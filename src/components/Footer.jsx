export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="container mx-auto px-4 text-center">
        
        <h2 className="text-xl font-bold mb-2">
          MyApp
        </h2>

        <p className="text-gray-400 mb-4">
          Aplikasi sederhana berbasis React.
        </p>

        <div className="flex justify-center gap-4 mb-4">
          <a href="#" className="hover:text-gray-300">
            Home
          </a>

          <a href="#" className="hover:text-gray-300">
            Produk
          </a>

          <a href="#" className="hover:text-gray-300">
            Kontak
          </a>
        </div>

        <p className="text-gray-500 text-sm">
          © 2026 MyApp. All rights reserved.
        </p>

      </div>
    </footer>
  );
}