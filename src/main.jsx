import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./assets/tailwind.css";
import App from "./App";

/**
 * BrowserRouter adalah komponen wrapper yang mengaktifkan routing di aplikasi React.
 * Semua komponen yang ingin menggunakan React Router harus dibungkus di dalam BrowserRouter.
 * BrowserRouter memungkinkan penggunaan fitur seperti Routes, Route, Link, dan useNavigate.
 * 
 * Penjelasan BrowserRouter:
 * - Mengaktifkan history API untuk navigasi browser
 * - Memungkinkan penggunaan Link dan useNavigate
 * - Menyediakan context untuk komponen routing
 * - Otomatis mendeteksi perubahan URL dan update UI
 */

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
