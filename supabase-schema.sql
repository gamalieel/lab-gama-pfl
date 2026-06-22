-- ============================================================
-- SUPABASE DDL SCHEMA + RLS POLICIES
-- Project: Gacor Restaurant Admin Dashboard
-- ============================================================
-- INSTRUKSI: Copy seluruh SQL ini ke Supabase SQL Editor
-- dan eksekusi secara berurutan.
-- ============================================================

-- =====================
-- 1. CUSTOM TYPES (ENUM)
-- =====================
CREATE TYPE user_role AS ENUM ('Admin', 'Member', 'Guest');
CREATE TYPE member_tier AS ENUM ('Bronze', 'Silver', 'Gold', 'Platinum');
CREATE TYPE order_status AS ENUM ('Pending', 'Completed', 'Cancelled');

-- =====================
-- 2. TABEL: profiles
-- =====================
-- Menyimpan informasi tambahan user dari Supabase Auth.
-- Field `city` ditambahkan untuk kebutuhan halaman Customers.
-- Field `total_orders` di-compute via trigger dari tabel orders.
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255),
    role user_role DEFAULT 'Member' NOT NULL,
    tier member_tier DEFAULT 'Bronze' NOT NULL,
    points INT DEFAULT 0 NOT NULL,
    city VARCHAR(255) DEFAULT '' NOT NULL,
    total_orders INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================
-- 3. TABEL: products
-- =====================
-- Menyimpan data produk.
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    stock INT DEFAULT 0 NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================
-- 4. TABEL: orders
-- =====================
-- Menyimpan data transaksi.
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    subtotal NUMERIC NOT NULL,
    discount_amount NUMERIC DEFAULT 0 NOT NULL,
    total_price NUMERIC NOT NULL,
    points_earned INT DEFAULT 0 NOT NULL,
    status order_status DEFAULT 'Pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================
-- 5. TABEL: order_items
-- =====================
-- Detail item di dalam setiap pesanan (Many-to-Many Bridge).
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================

-- Aktifkan RLS pada seluruh tabel
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Kebijakan untuk PROFILES
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'));

CREATE POLICY "Admins can update profiles"
    ON profiles FOR UPDATE
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'));

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Service can insert profiles"
    ON profiles FOR INSERT
    WITH CHECK (true);

-- Kebijakan untuk PRODUCTS
CREATE POLICY "Anyone can view products"
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert/update/delete products"
    ON products FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'));

-- Kebijakan untuk ORDERS
CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders"
    ON orders FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'));

-- Kebijakan untuk ORDER_ITEMS
CREATE POLICY "Users can view their own order items"
    ON order_items FOR SELECT
    USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Users can insert their own order items"
    ON order_items FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Admins can manage all order items"
    ON order_items FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'));

-- =====================
-- 7. TRIGGER: Auto-create profile on signup
-- =====================
-- Saat user baru mendaftar via Supabase Auth,
-- otomatis buat row di tabel profiles dengan role 'Member'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, tier, points)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        'Member',
        'Bronze',
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- 8. TRIGGER: Update tier based on points
-- =====================
-- Otomatis update tier saat points berubah.
CREATE OR REPLACE FUNCTION public.update_member_tier()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.points >= 3000 THEN
        NEW.tier := 'Platinum';
    ELSIF NEW.points >= 1500 THEN
        NEW.tier := 'Gold';
    ELSIF NEW.points >= 500 THEN
        NEW.tier := 'Silver';
    ELSE
        NEW.tier := 'Bronze';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_points_changed
    BEFORE UPDATE OF points ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_member_tier();

-- =====================
-- 9. TRIGGER: Update total_orders on order insert/delete
-- =====================
CREATE OR REPLACE FUNCTION public.update_total_orders()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE profiles SET total_orders = total_orders + 1 WHERE id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE profiles SET total_orders = total_orders - 1 WHERE id = OLD.user_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_changed
    AFTER INSERT OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION public.update_total_orders();
