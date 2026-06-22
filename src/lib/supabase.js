import { createClient } from "@supabase/supabase-js";

// Konfigurasi Supabase - menggunakan credentials yang sama dengan notesAPI.js
const SUPABASE_URL = "https://ignpqffzzrgzeoxnwaph.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnbnBxZmZ6enJnemVveG53YXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4OTcyOTIsImV4cCI6MjA5NjQ3MzI5Mn0.bdQq9nSTX6Nw_427QhOsPEgwkETJ1lVrPlHmEpkm1KI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===========================
// AUTH HELPERS
// ===========================

/** Login dengan email & password via Supabase Auth */
export async function signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

/** Register user baru via Supabase Auth (otomatis buat profile via trigger) */
export async function signUpWithEmail(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName },
        },
    });
    if (error) throw error;
    return data;
}

/** Logout user */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/** Ambil session user yang sedang login */
export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

/** Ambil data user yang sedang login */
export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/** Reset password - kirim email reset */
export async function resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
}

// ===========================
// PROFILE HELPERS
// ===========================

/** Ambil profile user yang sedang login */
export async function getMyProfile() {
    const user = await getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) throw error;
    return data;
}

/** Ambil semua profiles (untuk Admin - halaman Customers) */
export async function getAllProfiles() {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

/** Update profile */
export async function updateProfile(profileId, updates) {
    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profileId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ===========================
// PRODUCT HELPERS
// ===========================

/** Ambil semua produk */
export async function getAllProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

/** Ambil satu produk berdasarkan ID */
export async function getProductById(productId) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

    if (error) throw error;
    return data;
}

/** Tambah produk baru (Admin only) */
export async function insertProduct(product) {
    const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/** Update produk (Admin only) */
export async function updateProduct(productId, updates) {
    const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", productId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/** Hapus produk (Admin only) */
export async function deleteProduct(productId) {
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

    if (error) throw error;
}

// ===========================
// ORDER HELPERS
// ===========================

/** Ambil semua orders milik user yang sedang login */
export async function getMyOrders() {
    const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

/** Ambil semua orders (Admin) */
export async function getAllOrders() {
    const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*), profiles(full_name, email)")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Buat order baru beserta order_items.
 * Menghitung poin dan diskon berdasarkan tier.
 * @param {Array} items - Array of { product_id, quantity, price_at_purchase }
 * @param {object} profile - Profile user yang membuat order
 */
export async function createOrder(items, profile) {
    // Hitung subtotal
    const subtotal = items.reduce(
        (sum, item) => sum + item.price_at_purchase * item.quantity,
        0
    );

    // Hitung diskon berdasarkan tier
    const discountRate = getDiscountRate(profile.tier);
    const discountAmount = Math.round(subtotal * discountRate);
    const totalPrice = subtotal - discountAmount;

    // Hitung poin: setiap kelipatan Rp 10.000 = 1 poin
    const pointsEarned = Math.floor(totalPrice / 10000);

    // Insert order
    const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: profile.id,
            subtotal,
            discount_amount: discountAmount,
            total_price: totalPrice,
            points_earned: pointsEarned,
            status: "Pending",
        })
        .select()
        .single();

    if (orderError) throw orderError;

    // Insert order_items
    const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
    }));

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update poin user
    if (pointsEarned > 0) {
        const { data: currentProfile } = await supabase
            .from("profiles")
            .select("points")
            .eq("id", profile.id)
            .single();

        if (currentProfile) {
            await supabase
                .from("profiles")
                .update({ points: currentProfile.points + pointsEarned })
                .eq("id", profile.id);
        }
    }

    return orderData;
}

/**
 * Hitung rate diskon berdasarkan tier
 * @param {string} tier - Member tier
 * @returns {number} Discount rate (0 - 0.20)
 */
function getDiscountRate(tier) {
    switch (tier) {
        case "Platinum": return 0.20;
        case "Gold": return 0.15;
        case "Silver": return 0.10;
        case "Bronze": return 0.05;
        default: return 0;
    }
}
