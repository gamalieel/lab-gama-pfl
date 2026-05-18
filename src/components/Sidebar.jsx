import { Link } from "react-router-dom";
import { FaHeadphonesAlt, FaList, FaPlus, FaThLarge, FaTrashAlt } from "react-icons/fa";

/**
 * MenuIcon Component - Menampilkan ikon yang sesuai untuk setiap menu
 * @param {string} menuId - ID dari menu item untuk menentukan ikon yang ditampilkan
 * @returns {JSX.Element} Ikon dari react-icons
 */
function MenuIcon({ menuId }) {
    if (menuId === "dashboard") {
        return <FaThLarge />;
    }

    if (menuId === "orders") {
        return <FaList />;
    }

    if (menuId === "customers") {
        return <FaHeadphonesAlt />;
    }

    return <FaPlus />;
}

/**
 * SidebarMenuItem Component - Satu item menu di sidebar untuk navigasi
 * 
 * Menggunakan Link dari React Router untuk navigasi tanpa reload halaman
 * Link menggantikan tag <div> biasa untuk memungkinkan routing
 * 
 * @param {string} id - ID unik dari menu item
 * @param {string} label - Label/teks yang ditampilkan
 * @param {boolean} isActive - Status apakah menu sedang aktif
 * @param {boolean} removable - Apakah menu bisa dihapus
 * @param {function} onClick - Callback saat menu diklik
 * @param {function} onRemove - Callback saat tombol hapus diklik
 */
function SidebarMenuItem({ id, label, isActive, removable, onClick, onRemove }) {
    /**
     * getMenuPath - Menentukan path URL berdasarkan ID menu
     * Mengembalikan path yang sesuai untuk Link
     */
    function getMenuPath(menuId) {
        if (menuId === "dashboard") return "/";
        if (menuId === "orders") return "/orders";
        if (menuId === "customers") return "/customers";
        return "/";
    }

    return (
        <li>
            <Link
                id={id === "dashboard" ? "menu-1" : id === "orders" ? "menu-2" : id === "customers" ? "menu-3" : id}
                to={getMenuPath(id)}
                className="sidebar-menu-row"
                data-active={isActive ? "true" : "false"}
                onClick={() => onClick(id)}
            >
                <span className="sidebar-menu-button">
                    <MenuIcon menuId={id} />
                    <span>{label}</span>
                </span>
                {removable ? (
                    <button
                        type="button"
                        className="sidebar-menu-delete-button"
                        aria-label={`Delete ${label}`}
                        onClick={(e) => {
                            e.preventDefault();
                            onRemove(id);
                        }}
                    >
                        <FaTrashAlt />
                    </button>
                ) : null}
            </Link>
        </li>
    );
}

/**
 * Sidebar Component - Sidebar utama aplikasi
 * Berisi logo, daftar menu navigasi, dan kartu footer
 * 
 * @param {string} activeSection - Menu yang sedang aktif untuk styling
 * @param {Array} menuItems - Daftar item menu yang akan ditampilkan
 * @param {function} onMenuClick - Callback saat menu diklik
 * @param {function} onAddMenu - Callback saat tombol Add Menu ditekan
 * @param {function} onRemoveMenu - Callback saat menu dihapus
 */
export default function Sidebar({ activeSection, menuItems, onMenuClick, onAddMenu, onRemoveMenu }) {
    return (
        <div id="sidebar">
            {/* Logo Section */}
            <div id="sidebar-logo">
                <span id="logo-title">
                    Gacor <b id="logo-dot">.</b>
                </span>
                <span id="logo-subtitle">Dashboard Admin Gacor</span>
            </div>

            {/* Menu List Section */}
            <div id="sidebar-menu">
                <ul id="menu-list">
                    {menuItems.map((item) => (
                        <SidebarMenuItem
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            isActive={activeSection === item.id}
                            removable={item.removable}
                            onClick={onMenuClick}
                            onRemove={onRemoveMenu}
                        />
                    ))}
                </ul>
            </div>

            {/* Footer Section */}
            <div id="sidebar-footer">
                <div id="footer-card">
                    <div id="footer-text">
                        <span>Fitur tambah menu tapi belum bisa digunakan!</span>
                        <button id="add-menu-button" type="button" onClick={onAddMenu}>
                            <span>Tambah Menu</span>
                        </button>
                    </div>
                    <img id="footer-avatar" src="/img/Gacor77.png" alt="Footer avatar" />
                </div>
                <span id="footer-brand">Gacor Restaurant Admin Dashboard</span>
            </div>
        </div>
    );
}
