import { Link } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";

/**
 * NotFound Component - Halaman 404 untuk URL yang tidak ditemukan
 * Menggunakan template error page yang modern dan professional
 * 
 * Design berdasarkan Figma template dengan:
 * - Error code yang menonjol (404)
 * - Pesan error yang jelas
 * - CTA button untuk kembali ke dashboard
 * - Design card yang modern dan responsive
 */
export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Error Card Container */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Card Header dengan Logo */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-6 flex items-center justify-between">
                        <span className="text-white text-sm font-semibold uppercase tracking-wider">Gacor.</span>
                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs">≡</span>
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="px-8 py-12 flex flex-col gap-6">
                        {/* Error Code - Large and Bold */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center gap-1">
                                <span className="text-6xl font-black text-blue-900">4</span>
                                <span className="text-6xl font-black text-blue-400">0</span>
                                <span className="text-6xl font-black text-blue-900">4</span>
                            </div>
                        </div>

                        {/* Profile Picture */}
                        <div className="flex justify-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-md">
                                <img
                                    src="/img/Gacor77.png"
                                    alt="Gacor Restaurant"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Error Title */}
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-blue-900 capitalize">
                                Halaman Tidak Ditemukan
                            </h1>
                        </div>

                        {/* Error Description */}
                        <div className="space-y-3 text-center">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Maaf, halaman yang Anda cari tidak tersedia. URL yang Anda akses tidak sesuai dengan halaman di sistem kami.
                            </p>
                            <p className="text-xs text-gray-500">
                                Hubungi tim support kami jika Anda memerlukan bantuan lebih lanjut.
                            </p>
                        </div>

                        {/* CTA Button */}
                        <Link
                            to="/"
                            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                        >
                            <FaHome className="text-lg" />
                            Kembali ke Dashboard
                        </Link>

                        {/* Alternative Link */}
                        <button
                            onClick={() => window.history.back()}
                            className="w-full bg-gray-100 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <FaArrowLeft className="text-sm" />
                            Kembali ke Halaman Sebelumnya
                        </button>
                    </div>

                    {/* Card Footer - Messaging Options */}
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                        <p className="text-xs text-gray-600 text-center mb-4">
                            Hubungi kami atau ikuti media sosial untuk informasi lebih lanjut
                        </p>
                        <div className="flex justify-center gap-3">
                            {/* Email Link */}
                            <a
                                href="mailto:support@gacor.com"
                                className="px-3 py-1.5 bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                                title="Email support"
                            >
                                Email
                            </a>
                            {/* Messenger Link */}
                            <a
                                href="#"
                                className="px-3 py-1.5 bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                                title="Chat on Messenger"
                            >
                                Chat
                            </a>
                        </div>
                    </div>

                    {/* Social Media Icons */}
                    <div className="bg-white px-8 py-4 border-t border-gray-100 flex justify-center gap-4">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-6 h-6 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center text-white text-xs font-bold"
                                title={`Social media ${i + 1}`}
                            >
                                {i + 1}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Error Code: 404 | Gacor Restaurant Admin Dashboard © 2025
                    </p>
                </div>
            </div>
        </div>
    );
}
