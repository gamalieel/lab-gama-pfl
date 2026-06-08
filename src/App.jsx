import React, { Suspense, useState, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import FiturXyz from "./pages/Main/FiturXyz";
import Note from "./pages/Main/Note";
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

// Data awal untuk orders (pesanan)
const orderRows = [
    { id: "001", customer: "Gama", item: "Ayam", total: "Rp.78.000", status: "Preparing" },
    { id: "002", customer: "Liel", item: "Kebab", total: "Rp.92.000", status: "On Delivery" },
    { id: "003", customer: "Paldo", item: "Burger", total: "Rp.105.000", status: "Delivered" },
    { id: "004", customer: "Yogi", item: "Coffe", total: "Rp.64.000", status: "Canceled" },
    { id: "005", customer: "Hayukk", item: "Pizza", total: "Rp.88.000", status: "Preparing" },
];

// Data awal untuk customers (pelanggan)
const customerRows = [
    { id: "001", name: "Gama", email: "Gama@email.com", totalOrder: 14, city: "Bandung", tier: "Gold" },
    { id: "002", name: "Liel", email: "Liel@email.com", totalOrder: 9, city: "Jakarta", tier: "Silver" },
    { id: "003", name: "Paldo", email: "Paldo@email.com", totalOrder: 21, city: "Surabaya", tier: "Platinum" },
    { id: "004", name: "Yogi", email: "Yogi@email.com", totalOrder: 5, city: "Malang", tier: "Bronze" },
    { id: "005", name: "Hayukk", email: "Hayukk@email.com", totalOrder: 12, city: "Semarang", tier: "Gold" },
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
 * getNextId - Menghasilkan ID 3 digit berikutnya dari daftar item
 * Contoh: jika ID terakhir adalah 005, maka akan menghasilkan 006
 * @param {Array} items - Daftar item yang memiliki properti id
 * @returns {string} ID 3 digit dengan padding nol di depan
 */
function getNextId(items) {
    const maxId = items.reduce((maxValue, item) => {
        const numeric = Number(String(item.id).replace(/[^0-9]/g, ""));
        return numeric > maxValue ? numeric : maxValue;
    }, 0);

    return String(maxId + 1).padStart(3, "0");
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
    // State untuk menyimpan data orders
    const [ordersData, setOrdersData] = useState(orderRows);
    // State untuk menyimpan data customers
    const [customersData, setCustomersData] = useState(customerRows);

    /**
     * dashboardCards - Menghitung statistik dashboard dari data orders
     * Statistik yang dihitung: Total Orders, Total Delivered, Total Canceled, Total Revenue
     * Menggunakan useMemo agar hanya dihitung ulang saat ordersData berubah
     */
    const dashboardCards = useMemo(() => {
        const totalOrders = ordersData.length;
        const totalDelivered = ordersData.filter((item) => item.status === "Delivered").length;
        const totalCanceled = ordersData.filter((item) => item.status === "Canceled").length;
        const totalRevenue = ordersData.reduce(
            (total, item) => total + (item.status === "Canceled" ? 0 : parseRupiah(item.total)),
            0,
        );

        return [
            { id: "orders", icon: "cart", value: String(totalOrders), label: "Total Orders" },
            { id: "delivered", icon: "truck", value: String(totalDelivered), label: "Total Delivered" },
            { id: "canceled", icon: "ban", value: String(totalCanceled), label: "Total Canceled" },
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
        const newOrderId = getNextId(ordersData);
        const normalizedTotal = formatRupiah(parseRupiah(orderPayload.total));

        setOrdersData((currentOrders) => [
            {
                id: newOrderId,
                customer: orderPayload.customer.trim(),
                item: orderPayload.item.trim(),
                total: normalizedTotal,
                status: orderPayload.status,
            },
            ...currentOrders,
        ]);

        // Sinkronkan customer: jika sudah ada, totalOrder naik; jika belum, buat baru
        setCustomersData((currentCustomers) => {
            const targetName = orderPayload.customer.trim().toLowerCase();
            const existingCustomer = currentCustomers.find(
                (customer) => customer.name.toLowerCase() === targetName,
            );

            if (existingCustomer) {
                return currentCustomers.map((customer) =>
                    customer.name.toLowerCase() === targetName
                        ? { ...customer, totalOrder: customer.totalOrder + 1 }
                        : customer,
                );
            }

            return [
                {
                    id: getNextId(currentCustomers),
                    name: orderPayload.customer.trim(),
                    email: `${orderPayload.customer.trim().replace(/\s+/g, "").toLowerCase()}@email.com`,
                    totalOrder: 1,
                    city: "Unknown",
                    tier: "Bronze",
                },
                ...currentCustomers,
            ];
        });
    }

    /**
     * handleAddCustomer - Menambahkan customer baru dari form Customers
     */
    function handleAddCustomer(customerPayload) {
        const newCustomerId = getNextId(customersData);

        setCustomersData((currentCustomers) => [
            {
                id: newCustomerId,
                name: customerPayload.name.trim(),
                email: customerPayload.email.trim(),
                totalOrder: Number(customerPayload.totalOrder || 0),
                city: customerPayload.city.trim(),
                tier: customerPayload.tier,
            },
            ...currentCustomers,
        ]);
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
                                onAddOrder={handleAddOrder}
                                onAddCustomer={handleAddCustomer}
                                searchQuery={searchQuery}
                                isEmpty={isDashboardEmpty}
                                isOrdersEmpty={isOrdersEmpty}
                                isCustomersEmpty={isCustomersEmpty}
                            />
                        }
                    />

                    {/* Kode sebelumnya (disimpan sebagai komentar, tidak dihapus):
                    <Route
                        path="/"
                        element={
                            <Dashboard
                                activeSection={activeSection}
                                cards={filteredDashboardCards}
                                orders={filteredOrders}
                                customers={filteredCustomers}
                                onAddOrder={handleAddOrder}
                                onAddCustomer={handleAddCustomer}
                                searchQuery={searchQuery}
                                isEmpty={isDashboardEmpty}
                                isOrdersEmpty={isOrdersEmpty}
                                isCustomersEmpty={isCustomersEmpty}
                            />
                        }
                    />
                    */}

                    <Route
                        path="/orders"
                        element={
                            <Orders
                                orders={filteredOrders}
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
                            <Components
                           />
                        }
                    />
                    <Route
                        path="/fitur-xyz"
                        element={
                            <FiturXyz
                           />
                        }
                    />
                    <Route
                        path="/notes"
                        element={
                            <Note
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
                        path="/products/:id"
                        element={
                            <ProductDetail />
                        }
                    />

                    <Route
                        path="/products"
                        element={
                            <Products isEmpty={false} />
                        }
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </MainLayout>
        </Suspense>
    );
}
