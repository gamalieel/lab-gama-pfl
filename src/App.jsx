import React, { Suspense, useState, useMemo, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import FiturXyz from "./pages/Main/FiturXyz";
import Note from "./pages/Main/Note";
import {
    supabase,
    getMyProfile,
    getAllOrders,
    getAllProfiles,
    getAllProducts,
    createOrder,
    updateProfile,
    signOut,
} from "./lib/supabase";
//import Loading from "./components/Loading";
// import Orders from "./pages/Main/Orders";
// import MainLayout from "./layout/MainLayout";
// import Dashboard from "./pages/Main/Dashboard";
// import Customers from "./pages/Main/Customers";
// import NotFound from "./pages/Main/NotFound";
// import AuthLayout from "./layout/AuthLayout";
// import Login from "./pages/Auth/Login";
// import Register from "./pages/Auth/Register";
// import Forgot from "./pages/Auth/Forgot";

const MainLayout = React.lazy(() => import("./layout/MainLayout"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Orders = React.lazy(() => import("./pages/Main/Orders"));
const Customers = React.lazy(() => import("./pages/Main/Customers"));
const Products = React.lazy(() => import("./pages/Main/Products"));
const ProductDetail = React.lazy(() => import("./pages/Main/ProductDetail"));
const NotFound = React.lazy(() => import("./pages/Main/NotFound"));
const AuthLayout = React.lazy(() => import("./layout/AuthLayout"));
const Login = React.lazy(() => import("./pages/Auth/Login"));
const Register = React.lazy(() => import("./pages/Auth/Register"));
const Forgot = React.lazy(() => import("./pages/Auth/Forgot"));
const Loading = React.lazy(() => import("./components/Loading"));
const Components = React.lazy(() => import("./pages/Auth/Components"));



// Data awal untuk menu sidebar
const initialMenuItems = [
    { id: "dashboard", label: "Dashboard", removable: false },
    { id: "orders", label: "Orders", removable: false },
    { id: "customers", label: "Customers", removable: false },
    { id: "products", label: "Products", removable: false },
    
];

/**
 * parseRupiah - Mengubah teks rupiah seperti Rp.78.000 menjadi angka
 * @param {string|number} value - Nilai dalam format rupiah atau angka
 * @returns {number} Nilai dalam bentuk angka untuk keperluan kalkulasi
 */
function parseRupiah(value) {
    const onlyDigits = String(value).replace(/[^0-9]/g, "");
    return Number(onlyDigits || 0);
}

/**
 * formatRupiah - Memformat angka menjadi tampilan rupiah sederhana
 * @param {number} value - Nilai dalam bentuk angka
 * @returns {string} Nilai terformat dalam bentuk Rp.XX.XXX
 */
function formatRupiah(value) {
    return `Rp.${new Intl.NumberFormat("id-ID").format(value)}`;
}

/**
 * App Component - Komponen utama aplikasi dengan routing
 * 
 * Fitur-fitur:
 * - Menampilkan sidebar dengan menu navigasi
 * - Routing menggunakan React Router (Dashboard, Orders, Customers)
 * - Search bar untuk filtering data
 * - State management untuk data orders, customers, dan menu
 */
export default function App() {
    const location = useLocation();
    const isAuthPage = ["/login", "/register", "/forgot"].includes(location.pathname);

    // State untuk menu yang sedang aktif (untuk styling di sidebar)
    const [activeSection, setActiveSection] = useState("dashboard");
    // State untuk menyimpan nilai input search
    const [searchQuery, setSearchQuery] = useState("");
    // State untuk menyimpan daftar menu di sidebar
    const [menuItems, setMenuItems] = useState(initialMenuItems);
    // State untuk menyimpan data orders (dari Supabase)
    const [ordersData, setOrdersData] = useState([]);
    // State untuk menyimpan data customers (dari Supabase)
    const [customersData, setCustomersData] = useState([]);
    // State untuk menyimpan data products (dari Supabase)
    const [productsData, setProductsData] = useState([]);
    // Auth state
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(false);
    const navigate = useNavigate();

    /**
     * fetchAllData - Mengambil semua data dari Supabase
     */
    async function fetchAllData() {
        setDataLoading(true);
        try {
            const [ordersResult, profilesResult, productsResult] = await Promise.all([
                getAllOrders(),
                getAllProfiles(),
                getAllProducts(),
            ]);

            // Map orders dari Supabase ke format yang diharapkan UI
            setOrdersData(
                ordersResult.map((order) => ({
                    id: order.id,
                    customer: order.profiles?.full_name || "Unknown",
                    item: order.order_items
                        ? order.order_items.map((oi) => oi.product_id).join(", ")
                        : "-",
                    total: formatRupiah(order.total_price),
                    status: order.status,
                }))
            );

            // Map profiles ke format customers yang diharapkan UI
            setCustomersData(
                profilesResult.map((p) => ({
                    id: p.id,
                    name: p.full_name || "",
                    email: p.email || "",
                    totalOrder: p.total_orders || 0,
                    city: p.city || "",
                    tier: p.tier || "Bronze",
                }))
            );

            setProductsData(
                productsResult.map((p) => ({
                    id: p.id,
                    title: p.name,
                    code: p.id.substring(0, 8),
                    category: p.description || "",
                    brand: "",
                    price: p.price,
                    stock: p.stock,
                }))
            );
        } catch (err) {
            console.error("Gagal mengambil data:", err);
        } finally {
            setDataLoading(false);
        }
    }

    // Auth listener - mendeteksi perubahan status login
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === "SIGNED_IN" && session?.user) {
                    setUser(session.user);
                    try {
                        const p = await getMyProfile();
                        setProfile(p);
                    } catch (err) {
                        console.error("Gagal mengambil profil:", err);
                    }
                } else if (event === "SIGNED_OUT") {
                    setUser(null);
                    setProfile(null);
                    setOrdersData([]);
                    setCustomersData([]);
                    setProductsData([]);
                }
                setAuthLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Fetch data saat user sudah login
    useEffect(() => {
        if (user) {
            fetchAllData();
        }
    }, [user]);

    /**
     * handleLogout - Logout user dari Supabase Auth
     */
    async function handleLogout() {
        try {
            await signOut();
            navigate("/login");
        } catch (err) {
            console.error("Gagal logout:", err);
        }
    }

    /**
     * dashboardCards - Menghitung statistik dashboard dari data orders
     * Statistik yang dihitung: Total Orders, Total Delivered, Total Canceled, Total Revenue
     * Menggunakan useMemo agar hanya dihitung ulang saat ordersData berubah
     */
    const dashboardCards = useMemo(() => {
        const totalOrders = ordersData.length;
        const totalDelivered = ordersData.filter((item) => item.status === "Completed").length;
        const totalCanceled = ordersData.filter((item) => item.status === "Cancelled").length;
        const totalRevenue = ordersData.reduce(
            (total, item) => total + (item.status === "Cancelled" ? 0 : parseRupiah(item.total)),
            0,
        );

        return [
            { id: "orders", icon: "cart", value: String(totalOrders), label: "Total Orders" },
            { id: "delivered", icon: "truck", value: String(totalDelivered), label: "Total Completed" },
            { id: "canceled", icon: "ban", value: String(totalCanceled), label: "Total Cancelled" },
            { id: "revenue", icon: "money", value: formatRupiah(totalRevenue), label: "Total Revenue" },
        ];
    }, [ordersData]);

    /**
     * filteredMenuItems - Menu yang sudah difilter berdasarkan search
     * Saat ini mengembalikan semua menu (tidak difilter)
     */
    const filteredMenuItems = useMemo(() => {
        return menuItems;
    }, [menuItems]);

    /**
     * filteredDashboardCards - Kartu dashboard yang difilter berdasarkan search query
     * Search hanya aktif saat di halaman Dashboard
     */
    const filteredDashboardCards = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (activeSection !== "dashboard" || !query) {
            return dashboardCards;
        }

        return dashboardCards.filter((card) =>
            card.label.toLowerCase().includes(query),
        );
    }, [activeSection, dashboardCards, searchQuery]);

    /**
     * filteredOrders - Data orders yang difilter berdasarkan search query
     * Search hanya aktif saat di halaman Orders
     */
    const filteredOrders = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (activeSection !== "orders" || !query) {
            return ordersData;
        }

        return ordersData.filter((order) =>
            [order.id, order.customer, order.item, order.status]
                .join(" ")
                .toLowerCase()
                .includes(query),
        );
    }, [activeSection, ordersData, searchQuery]);

    /**
     * filteredCustomers - Data customers yang difilter berdasarkan search query
     * Search hanya aktif saat di halaman Customers
     */
    const filteredCustomers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (activeSection !== "customers" || !query) {
            return customersData;
        }

        return customersData.filter((customer) =>
            [customer.id, customer.name, customer.email, customer.city, customer.tier]
                .join(" ")
                .toLowerCase()
                .includes(query),
        );
    }, [activeSection, customersData, searchQuery]);

    /**
     * handleSectionChange - Mengubah menu yang sedang aktif
     * Dipanggil saat user mengklik menu di sidebar
     */
    function handleSectionChange(sectionId) {
        setActiveSection(sectionId);
    }

    /**
     * handleSearchChange - Menangani perubahan input search
     * Dipanggil saat user mengetik di search bar
     */
    function handleSearchChange(event) {
        setSearchQuery(event.target.value);
    }

    /**
     * handleAddMenu - Menambahkan menu baru ke sidebar
     * Menu baru bernama "Menu N" dan dapat dihapus (removable: true)
     */
    function handleAddMenu() {
        const newNumber = menuItems.filter((item) => item.id.startsWith("menu-")).length + 1;

        setMenuItems((currentItems) => [
            ...currentItems,
            {
                id: `menu-${newNumber}`,
                label: `Menu ${newNumber}`,
                removable: true,
            },
        ]);
    }

    /**
     * handleAddOrder - Menambahkan order baru dari form Orders
     * Juga sinkronisasi dengan data customers
     */
    function handleAddOrder(orderPayload) {
        if (!profile) return;

        async function doCreateOrder() {
            try {
                await createOrder(
                    [{
                        product_id: orderPayload.item,
                        quantity: 1,
                        price_at_purchase: parseRupiah(orderPayload.total),
                    }],
                    profile
                );
                await fetchAllData();
            } catch (err) {
                console.error("Gagal membuat order:", err);
            }
        }
        doCreateOrder();
    }

    /**
     * handleAddCustomer - Menambahkan customer baru dari form Customers
     */
    function handleAddCustomer(customerPayload) {
        async function doAddCustomer() {
            try {
                await updateProfile(customerPayload.id, {
                    full_name: customerPayload.name.trim(),
                    email: customerPayload.email.trim(),
                    city: customerPayload.city.trim(),
                    tier: customerPayload.tier,
                });
                await fetchAllData();
            } catch (err) {
                console.error("Gagal menambah customer:", err);
            }
        }
        doAddCustomer();
    }

    /**
     * handleRemoveMenu - Menghapus menu dari sidebar
     * Hanya menu dengan removable=true yang boleh dihapus
     * Jika menu yang dihapus adalah yang aktif, fokus berpindah ke menu lain
     */
    function handleRemoveMenu(menuId) {
        setMenuItems((currentItems) => {
            const targetItem = currentItems.find((item) => item.id === menuId);

            // Hanya menu dengan removable=true yang boleh dihapus
            if (!targetItem?.removable) {
                return currentItems;
            }

            const nextItems = currentItems.filter((item) => item.id !== menuId);

            if (activeSection === menuId) {
                const fallbackSection = nextItems[0]?.id ?? null;
                setActiveSection(fallbackSection);
            }

            return nextItems;
        });
    }

    /**
     * pageTitle - Menentukan judul halaman sesuai route yang aktif
     */
    const pageTitle =
        activeSection === "orders"
            ? "Orders"
            : activeSection === "customers"
                ? "Customers"
                : activeSection === "products"
                    ? "Products"
                    : "Dashboard";

    /**
     * pageBreadcrumb - Menentukan breadcrumb sesuai route yang aktif
     */
    const pageBreadcrumb =
        activeSection === "orders"
            ? "Home / Orders / Order List"
            : activeSection === "customers"
                ? "Home / Customers / Customer List"
                : activeSection === "products"
                    ? "Home / Products / Product List"
                    : "Home / Home Detail / Home Very Detail";

    // Mengecek apakah data kosong untuk menampilkan pesan empty state
    const isDashboardEmpty = filteredDashboardCards.length === 0;
    const isOrdersEmpty = filteredOrders.length === 0;
    const isCustomersEmpty = filteredCustomers.length === 0;

    if (isAuthPage) {
        if (authLoading) {
            return <div className="p-4 text-sm text-gray-500">Loading app...</div>;
        }
        if (user) {
            return <Navigate to="/" replace />;
        }
        return (
            <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading app...</div>}>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot" element={<Forgot />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        );
    }

    // Route protection: user harus login untuk mengakses dashboard
    if (authLoading || dataLoading) {
        return <div className="p-4 text-sm text-gray-500">Loading app...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
       <Suspense fallback={<Loading />}>
            <MainLayout
                activeSection={activeSection}
                menuItems={filteredMenuItems}
                onMenuClick={handleSectionChange}
                onAddMenu={handleAddMenu}
                onRemoveMenu={handleRemoveMenu}
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                pageTitle={pageTitle}
                pageBreadcrumb={pageBreadcrumb}
                onLogout={handleLogout}
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Dashboard
                                activeSection={activeSection}
                                cards={filteredDashboardCards}
                                orders={filteredOrders}
                                customers={filteredCustomers}
                                products={productsData}
                                profile={profile}
                                onAddOrder={handleAddOrder}
                                onAddCustomer={handleAddCustomer}
                                searchQuery={searchQuery}
                                isEmpty={isDashboardEmpty}
                                isOrdersEmpty={isOrdersEmpty}
                                isCustomersEmpty={isCustomersEmpty}
                            />
                        }
                    />

                    <Route
                        path="/orders"
                        element={
                            <Orders
                                orders={filteredOrders}
                                products={productsData}
                                profile={profile}
                                onAddOrder={handleAddOrder}
                                isEmpty={isOrdersEmpty}
                            />
                        }
                    />

                    <Route
                        path="/customers"
                        element={
                            <Customers
                                customers={filteredCustomers}
                                onAddCustomer={handleAddCustomer}
                                isEmpty={isCustomersEmpty}
                            />
                        }
                    />

                    <Route
                        path="/components"
                        element={
                            <Components />
                        }
                    />
                    <Route
                        path="/fitur-xyz"
                        element={
                            <FiturXyz />
                        }
                    />
                    <Route
                        path="/notes"
                        element={
                            <Note />
                        }
                    />
                    <Route
                        path="/products/:id"
                        element={
                            <ProductDetail />
                        }
                    />

                    <Route
                        path="/products"
                        element={
                            <Products products={productsData} isEmpty={false} />
                        }
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </MainLayout>
        </Suspense>
    );
}
