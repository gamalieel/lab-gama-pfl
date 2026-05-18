import { useState } from "react";

/**
 * Customers Component - Halaman untuk menampilkan dan menambah data pelanggan
 * 
 * Fitur:
 * - Menampilkan daftar pelanggan dalam bentuk grid/kartu
 * - Form untuk menambah pelanggan baru
 * - Search filtering untuk mencari pelanggan
 * 
 * @param {Array} customers - Daftar pelanggan yang akan ditampilkan
 * @param {function} onAddCustomer - Callback untuk menambah pelanggan baru
 * @param {boolean} isEmpty - Status apakah daftar pelanggan kosong (saat search)
 */
export default function Customers({ customers, onAddCustomer, isEmpty }) {
    // State untuk menyimpan nilai input form pelanggan
    const [customerForm, setCustomerForm] = useState({
        name: "",
        email: "",
        city: "",
        totalOrder: "",
        tier: "Bronze",
    });

    /**
     * getTierClass - Menentukan class CSS berdasarkan tier/level pelanggan
     * Setiap tier memiliki styling yang berbeda untuk keperluan visual
     * @param {string} tier - Tier pelanggan (Bronze, Silver, Gold, Platinum)
     * @returns {string} CSS class untuk styling tier badge
     */
    function getTierClass(tier) {
        if (tier === "Platinum") return "customer-tier platinum";
        if (tier === "Gold") return "customer-tier gold";
        if (tier === "Silver") return "customer-tier silver";
        return "customer-tier bronze";
    }

    /**
     * handleSubmitCustomer - Menangani submit form pelanggan baru
     * Melakukan validasi data sebelum memanggil callback onAddCustomer
     * Mengembalikan form ke state awal setelah submit berhasil
     * @param {Event} event - Event dari form submission
     */
    function handleSubmitCustomer(event) {
        event.preventDefault();

        // Validasi: semua field yang wajib harus terisi
        if (!customerForm.name.trim() || !customerForm.email.trim() || !customerForm.city.trim()) {
            alert("Silakan isi semua field yang wajib (nama, email, kota)");
            return;
        }

        // Panggil callback untuk menambah pelanggan
        onAddCustomer(customerForm);

        // Reset form ke state awal
        setCustomerForm({
            name: "",
            email: "",
            city: "",
            totalOrder: "",
            tier: "Bronze",
        });
    }

    return (
        <div id="dashboard-container">
            <div className="panel-card">
                {/* Judul Panel */}
                <div className="panel-title">Customers</div>

                {/* Form untuk menambah pelanggan baru */}
                <form className="quick-add-form" onSubmit={handleSubmitCustomer} noValidate>
                    {/* Input nama pelanggan */}
                    <input
                        type="text"
                        placeholder="Customer name"
                        aria-label="Customer name"
                        value={customerForm.name}
                        onChange={(event) =>
                            setCustomerForm((current) => ({ ...current, name: event.target.value }))
                        }
                        required
                    />

                    {/* Input email pelanggan */}
                    <input
                        type="email"
                        placeholder="Email"
                        aria-label="Email"
                        value={customerForm.email}
                        onChange={(event) =>
                            setCustomerForm((current) => ({ ...current, email: event.target.value }))
                        }
                        required
                    />

                    {/* Input kota tempat tinggal */}
                    <input
                        type="text"
                        placeholder="City"
                        aria-label="City"
                        value={customerForm.city}
                        onChange={(event) =>
                            setCustomerForm((current) => ({ ...current, city: event.target.value }))
                        }
                        required
                    />

                    {/* Input total pesanan sebelumnya */}
                    <input
                        type="number"
                        min="0"
                        placeholder="Total order"
                        aria-label="Total orders"
                        value={customerForm.totalOrder}
                        onChange={(event) =>
                            setCustomerForm((current) => ({ ...current, totalOrder: event.target.value }))
                        }
                    />

                    {/* Dropdown untuk memilih tier/level pelanggan */}
                    <select
                        aria-label="Customer tier"
                        value={customerForm.tier}
                        onChange={(event) =>
                            setCustomerForm((current) => ({ ...current, tier: event.target.value }))
                        }
                    >
                        <option value="Bronze">Bronze</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                        <option value="Platinum">Platinum</option>
                    </select>

                    {/* Tombol submit form */}
                    <button type="submit">Add Customer</button>
                </form>

                {/* Menampilkan pesan kosong jika tidak ada data */}
                {isEmpty ? (
                    <div id="dashboard-empty-state">
                        No customers found
                    </div>
                ) : (
                    /* Grid untuk menampilkan daftar pelanggan dalam bentuk kartu */
                    <div className="customers-grid">
                        {customers.map((customer) => (
                            <article key={customer.id} className="customer-card">
                                {/* Header kartu berisi nama, email, dan tier */}
                                <div className="customer-head">
                                    <div>
                                        <p className="customer-name">{customer.name}</p>
                                        <p className="customer-email">{customer.email}</p>
                                    </div>
                                    {/* Badge tier dengan styling yang sesuai */}
                                    <span className={getTierClass(customer.tier)}>
                                        {customer.tier}
                                    </span>
                                </div>

                                {/* Meta information berisi ID, kota, dan total pesanan */}
                                <div className="customer-meta">
                                    <span>{customer.id}</span>
                                    <span>{customer.city}</span>
                                    <span>{customer.totalOrder} Orders</span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
