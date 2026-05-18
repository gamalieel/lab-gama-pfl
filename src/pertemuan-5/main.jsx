import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./assets/tailwind.css";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import PageHeader from "./components/PageHeader";
import Dashboard from "./pages/Dashboard";

const initialMenuItems = [
    { id: "dashboard", label: "Dashboard", removable: false },
    { id: "orders", label: "Orders", removable: false },
    { id: "customers", label: "Customers", removable: false },
];

const orderRows = [
    { id: "001", customer: "Anugrah", item: "Ayam", total: "Rp.78.000", status: "Preparing" },
    { id: "002", customer: "Putra", item: "Kebab", total: "Rp.92.000", status: "On Delivery" },
    { id: "003", customer: "Fajar", item: "Burger", total: "Rp.105.000", status: "Delivered" },
    { id: "004", customer: "Traa", item: "Coffe", total: "Rp.64.000", status: "Canceled" },
    { id: "005", customer: "Toyy", item: "Pizza", total: "Rp.88.000", status: "Preparing" },
];

const customerRows = [
    { id: "001", name: "Anugrah", email: "Anugrah@email.com", totalOrder: 14, city: "Bandung", tier: "Gold" },
    { id: "002", name: "Putra", email: "Putra@email.com", totalOrder: 9, city: "Jakarta", tier: "Silver" },
    { id: "003", name: "Fajar", email: "Fajar@email.com", totalOrder: 21, city: "Surabaya", tier: "Platinum" },
    { id: "004", name: "Traa", email: "Traa@email.com", totalOrder: 5, city: "Malang", tier: "Bronze" },
    { id: "005", name: "Toyy", email: "Toyy@email.com", totalOrder: 12, city: "Semarang", tier: "Gold" },
];

// Mengubah teks rupiah seperti Rp.78.000 menjadi angka agar bisa dijumlahkan.
function parseRupiah(value) {
    const onlyDigits = String(value).replace(/[^0-9]/g, "");
    return Number(onlyDigits || 0);
}

// Memformat angka menjadi tampilan rupiah sederhana.
function formatRupiah(value) {
    return `Rp.${new Intl.NumberFormat("id-ID").format(value)}`;
}

// Menghasilkan ID 3 digit berikutnya, contoh: 006.
function getNextId(items) {
    const maxId = items.reduce((maxValue, item) => {
        const numeric = Number(String(item.id).replace(/[^0-9]/g, ""));
        return numeric > maxValue ? numeric : maxValue;
    }, 0);

    return String(maxId + 1).padStart(3, "0");
}

// App utama menyimpan state bersama untuk sidebar, search, dan konten dashboard.
export default function App() {
    // Menyimpan menu yang aktif supaya sidebar dan header bisa berubah saat diklik.
    const [activeSection, setActiveSection] = useState("dashboard");
    // Menyimpan isi search agar daftar kartu dan menu bisa difilter.
    const [searchQuery, setSearchQuery] = useState("");
    // Menyimpan daftar menu agar tombol Add Menu benar-benar menambah item baru.
    const [menuItems, setMenuItems] = useState(initialMenuItems);
    // Menyimpan data orders agar bisa ditambah dari fitur Orders.
    const [ordersData, setOrdersData] = useState(orderRows);
    // Menyimpan data customers agar bisa ditambah dari fitur Customers.
    const [customersData, setCustomersData] = useState(customerRows);

    // Statistik dashboard dihitung langsung dari data orders agar selalu sinkron.
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

    // Menyaring menu berdasarkan kata yang diketik di search bar.
    const filteredMenuItems = useMemo(() => {
        // Search hanya untuk konten halaman aktif, jadi menu sidebar selalu tampil utuh.
        return menuItems;
    }, [menuItems]);

    // Menyaring kartu dashboard berdasarkan kata kunci search.
    const filteredDashboardCards = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        // Search dashboard aktif hanya saat section Dashboard dibuka.
        if (activeSection !== "dashboard" || !query) {
            return dashboardCards;
        }

        return dashboardCards.filter((card) =>
            card.label.toLowerCase().includes(query),
        );
    }, [activeSection, dashboardCards, searchQuery]);

    // Menyaring data pesanan untuk halaman Orders.
    const filteredOrders = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        // Search orders aktif hanya saat section Orders dibuka.
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

    // Menyaring data pelanggan untuk halaman Customers.
    const filteredCustomers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        // Search customers aktif hanya saat section Customers dibuka.
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

    // Mengubah menu aktif ketika user mengklik item sidebar.
    function handleSectionChange(sectionId) {
        setActiveSection(sectionId);
    }

    // Menangani input search pada header.
    function handleSearchChange(event) {
        setSearchQuery(event.target.value);
    }

    // Menambahkan menu baru ke sidebar saat tombol Add Menu ditekan.
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

    // Menambahkan order baru dari form Orders.
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

        // Sinkronkan customer: jika sudah ada, totalOrder naik; jika belum, buat baru.
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

    // Menambahkan customer baru dari form Customers.
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

    // Menghapus menu dari sidebar dan memindahkan fokus ke menu berikutnya bila perlu.
    function handleRemoveMenu(menuId) {
        setMenuItems((currentItems) => {
            const targetItem = currentItems.find((item) => item.id === menuId);

            // Hanya menu dengan removable=true yang boleh dihapus.
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

    // Menentukan judul halaman sesuai menu yang sedang aktif.
    const pageTitle =
        activeSection === "orders"
            ? "Orders"
            : activeSection === "customers"
              ? "Customers"
              : "Dashboard";

    // Menentukan breadcrumb sederhana agar header mengikuti menu yang dipilih.
    const pageBreadcrumb =
        activeSection === "orders"
            ? "Home / Orders / Order List"
            : activeSection === "customers"
              ? "Home / Customers / Customer List"
              : "Home / Home Detail / Home Very Detail";

    // Kalau search tidak menemukan hasil, dashboard akan menampilkan pesan kosong.
    const isDashboardEmpty = filteredDashboardCards.length === 0;
    const isOrdersEmpty = filteredOrders.length === 0;
    const isCustomersEmpty = filteredCustomers.length === 0;

    return (
        <div className="min-h-screen bg-latar font-poppins text-teks">
            <div className="flex min-h-screen flex-col lg:flex-row">
                <Sidebar
                    activeSection={activeSection}
                    menuItems={filteredMenuItems}
                    onMenuClick={handleSectionChange}
                    onAddMenu={handleAddMenu}
                    onRemoveMenu={handleRemoveMenu}
                />
                <main className="flex-1 p-4 md:p-6 xl:p-8">
                    <Header
                        searchValue={searchQuery}
                        onSearchChange={handleSearchChange}
                    />
                    <div className="mt-6 space-y-6">
                        <PageHeader
                            title={pageTitle}
                            subtitle={pageBreadcrumb}
                            actionLabel="Add Button"
                        />
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
                    </div>
                </main>
            </div>
        </div>
    );
}

createRoot(document.getElementById("root")).render(<App />);
