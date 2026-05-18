import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productsData from "../../data/products.json";

/**
 * Products Component - Halaman untuk menampilkan daftar produk
 * 
 * Fitur:
 * - Menampilkan daftar produk dalam bentuk tabel
 * - Setiap produk dapat diklik untuk melihat detail
 * - Menampilkan informasi: ID, Judul, Kode, Kategori, Brand, Harga, Stok
 * - Search filtering untuk mencari produk berdasarkan judul atau kategori
 * 
 * @param {boolean} isEmpty - Status apakah daftar produk kosong (saat search)
 */
export default function Products({ isEmpty }) {
    // State untuk menyimpan daftar produk yang ditampilkan
    const [products, setProducts] = useState([]);
    // State untuk menyimpan nilai input search
    const [searchQuery, setSearchQuery] = useState("");

    /**
     * useEffect - Menginisialisasi data produk dari JSON pada saat component mount
     * Dijalankan satu kali saat component pertama kali di-render
     */
    useEffect(() => {
        setProducts(productsData);
    }, []);

    /**
     * handleSearchChange - Menangani perubahan input search
     * Memperbarui searchQuery state saat user mengetik di search bar
     * @param {Event} event - Event dari input search
     */
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    /**
     * filteredProducts - Filter produk berdasarkan search query
     * Mencari di kolom judul dan kategori produk
     * @returns {Array} Daftar produk yang sesuai dengan search query
     */
    const filteredProducts = searchQuery.trim() === ""
        ? products
        : products.filter((product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

    /**
     * formatRupiah - Mengubah angka menjadi format Rupiah
     * Contoh: 45000 → "Rp 45.000"
     * @param {number} amount - Jumlah dalam bentuk angka
     * @returns {string} Angka yang sudah diformat dengan Rp
     */
    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div id="dashboard-container">
            <div className="panel-card">
                {/* Header panel dengan judul */}
                <div className="panel-title">Products</div>

                {/* Search bar untuk filter produk */}
                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="Search by product name or category..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            fontSize: "14px",
                        }}
                    />
                </div>

                {/* Menampilkan pesan kosong jika tidak ada data */}
                {filteredProducts.length === 0 ? (
                    <div id="dashboard-empty-state">
                        No products found
                    </div>
                ) : (
                    /* Tabel untuk menampilkan daftar produk */
                    <div style={{ overflowX: "auto" }}>
                        <table style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            backgroundColor: "#1e1e2e",
                        }}>
                            {/* Header tabel */}
                            <thead>
                                <tr style={{ backgroundColor: "#2d2d3d", borderBottom: "2px solid #444" }}>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>ID</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Title</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Code</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Category</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Brand</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Price</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Stock</th>
                                </tr>
                            </thead>

                            {/* Body tabel dengan data produk */}
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <tr 
                                        key={product.id}
                                        style={{
                                            borderBottom: "1px solid #333",
                                            backgroundColor: index % 2 === 0 ? "#1e1e2e" : "#232333",
                                        }}
                                    >
                                        <td style={{ padding: "12px" }}>{product.id}</td>
                                        <td style={{ padding: "12px" }}>
                                            {/* Link ke halaman detail produk berdasarkan ID */}
                                            <Link 
                                                to={`/products/${product.id}`}
                                                style={{
                                                    color: "#10b981",
                                                    textDecoration: "none",
                                                    fontWeight: 500,
                                                    cursor: "pointer",
                                                }}
                                                onMouseEnter={(e) => e.target.style.color = "#059669"}
                                                onMouseLeave={(e) => e.target.style.color = "#10b981"}
                                            >
                                                {product.title}
                                            </Link>
                                        </td>
                                        <td style={{ padding: "12px" }}>{product.code}</td>
                                        <td style={{ padding: "12px" }}>
                                            <span style={{
                                                backgroundColor: "#3b82f6",
                                                color: "white",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                fontWeight: 500,
                                            }}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px" }}>{product.brand}</td>
                                        <td style={{ padding: "12px", fontWeight: 600 }}>
                                            {formatRupiah(product.price)}
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                            <span style={{
                                                backgroundColor: product.stock > 20 ? "#10b981" : "#f59e0b",
                                                color: "white",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                fontWeight: 500,
                                            }}>
                                                {product.stock}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer menampilkan jumlah produk yang ditampilkan */}
                <div style={{ marginTop: "20px", fontSize: "14px", color: "#999" }}>
                    Showing {filteredProducts.length} of {products.length} products
                </div>
            </div>
        </div>
    );
}
