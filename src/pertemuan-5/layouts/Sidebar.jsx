import { FaUsers, FaList, FaPlus, FaThLarge, FaTrashAlt } from "react-icons/fa";

// Mengembalikan ikon yang sesuai untuk setiap menu sidebar.
function MenuIcon({ menuId }) {
    if (menuId === "dashboard") {
        return <FaThLarge />;
    }

    if (menuId === "orders") {
        return <FaList />;
    }

    if (menuId === "customers") {
        return <FaUsers />;
    }

    return <FaPlus />;
}

// Satu item menu di sidebar untuk navigasi dan tombol hapus.
function SidebarMenuItem({ id, label, isActive, removable, onClick, onRemove }) {
    return (
        <li>
            <div className="sidebar-menu-row" data-active={isActive ? "true" : "false"}>
                <button
                    type="button"
                    id={id === "dashboard" ? "menu-1" : id === "orders" ? "menu-2" : id === "customers" ? "menu-3" : id}
                    className="sidebar-menu-button"
                    onClick={() => onClick(id)}
                >
                    <MenuIcon menuId={id} />
                    <span>{label}</span>
                </button>
                {removable ? (
                    <button
                        type="button"
                        className="sidebar-menu-delete-button"
                        aria-label={`Delete ${label}`}
                        onClick={() => onRemove(id)}
                    >
                        <FaTrashAlt />
                    </button>
                ) : null}
            </div>
        </li>
    );
}

// Sidebar utama berisi logo, daftar menu, dan kartu footer Add Menu.
export default function Sidebar({ activeSection, menuItems, onMenuClick, onAddMenu, onRemoveMenu }) {
    return (
        <div id="sidebar">
            {/* Logo */}
            <div id="sidebar-logo">
                <span id="logo-title">
                    Mie Gacoan <b id="logo-dot">.</b>
                </span>
                <span id="logo-subtitle">Dashboard Admin Gacoan</span>
            </div>

            {/* List Menu */}
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

            {/* Footer */}
            <div id="sidebar-footer">
                <div id="footer-card">
                    <div id="footer-text">
                        <span>Please organize your menus through button below!</span>
                        <button id="add-menu-button" type="button" onClick={onAddMenu}>
                            <span>Tambah Menu</span>
                        </button>
                    </div>
                    <img src="" alt="" />
                </div>
                <span id="footer-brand">  Gacoan Admin Dashboard</span>
                <p id="footer-copyright">&copy; 2025 All Right Reserved</p>
            </div>
        </div>
    );
}