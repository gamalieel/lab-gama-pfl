import { useState } from "react";
import PageHeader from "../../components/PageHeader";

/**
 * Orders Component - Halaman untuk menampilkan dan menambah data orders
 * 
 * Fitur:
 * - Menampilkan daftar orders dalam bentuk tabel
 * - Form untuk menambah order baru
 * - Search filtering untuk mencari orders
 * 
 * @param {Array} orders - Daftar orders yang akan ditampilkan
 * @param {function} onAddOrder - Callback untuk menambah order baru
 * @param {boolean} isEmpty - Status apakah daftar orders kosong (saat search)
 */
export default function Orders({ orders, onAddOrder, isEmpty }) {
    // State untuk menyimpan nilai input form order
    const [orderForm, setOrderForm] = useState({
        customer: "",
        item: "",
        total: "",
        status: "Preparing",
    });

    /**
     * getOrderStatusClass - Menentukan class CSS berdasarkan status order
     * Setiap status memiliki styling yang berbeda untuk keperluan visual
     * @param {string} status - Status dari order (Preparing, On Delivery, Delivered, Canceled)
     * @returns {string} CSS class untuk styling status badge
     */
    function getOrderStatusClass(status) {
        if (status === "Delivered") return "order-status delivered";
        if (status === "On Delivery") return "order-status on-delivery";
        if (status === "Preparing") return "order-status preparing";
        return "order-status canceled";
    }

    /**
     * handleSubmitOrder - Menangani submit form order baru
     * Melakukan validasi data sebelum memanggil callback onAddOrder
     * Mengembalikan form ke state awal setelah submit berhasil
     * @param {Event} event - Event dari form submission
     */
    function handleSubmitOrder(event) {
        event.preventDefault();

        // Validasi: semua field harus terisi
        if (!orderForm.customer.trim() || !orderForm.item.trim() || !orderForm.total.trim()) {
            alert("Silakan isi semua field yang wajib");
            return;
        }

        // Panggil callback untuk menambah order
        onAddOrder(orderForm);

        // Reset form ke state awal
        setOrderForm({
            customer: "",
            item: "",
            total: "",
            status: "Preparing",
        });
    }

    return (
        <div id="dashboard-container">
            <div className="panel-card">
                {/* Judul Panel */}
                <div className="panel-title">Recent Orders</div>

                {/* Form untuk menambah order baru */}
                <form className="quick-add-form" onSubmit={handleSubmitOrder} noValidate>
                    {/* Input nama customer */}
                    <input
                        type="text"
                        placeholder="Customer name"
                        aria-label="Customer name"
                        value={orderForm.customer}
                        onChange={(event) =>
                            setOrderForm((current) => ({ ...current, customer: event.target.value }))
                        }
                        required
                    />

                    {/* Input menu item */}
                    <input
                        type="text"
                        placeholder="Menu item"
                        aria-label="Menu item"
                        value={orderForm.item}
                        onChange={(event) =>
                            setOrderForm((current) => ({ ...current, item: event.target.value }))
                        }
                        required
                    />

                    {/* Input total harga (dalam angka) */}
                    <input
                        type="text"
                        placeholder="Total (contoh: 78000)"
                        aria-label="Total"
                        value={orderForm.total}
                        onChange={(event) =>
                            setOrderForm((current) => ({ ...current, total: event.target.value }))
                        }
                        required
                    />

                    {/* Dropdown untuk memilih status order */}
                    <select
                        aria-label="Order status"
                        value={orderForm.status}
                        onChange={(event) =>
                            setOrderForm((current) => ({ ...current, status: event.target.value }))
                        }
                    >
                        <option value="Preparing">Preparing</option>
                        <option value="On Delivery">On Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Canceled">Canceled</option>
                    </select>

                    {/* Tombol submit form */}
                    <button type="submit">Add Order</button>
                </form>

                {/* Menampilkan pesan kosong jika tidak ada data */}
                {isEmpty ? (
                    <div id="dashboard-empty-state">
                        No orders found
                    </div>
                ) : (
                    /* Tabel untuk menampilkan daftar orders */
                    <div className="table-wrapper">
                        <table className="panel-table">
                            {/* Header tabel */}
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Item</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            {/* Body tabel - menampilkan setiap order */}
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.item}</td>
                                        <td>{order.total}</td>
                                        <td>
                                            {/* Badge status dengan styling yang sesuai */}
                                            <span className={getOrderStatusClass(order.status)}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
