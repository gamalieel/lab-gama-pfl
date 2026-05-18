import React, { useState } from 'react';
import BooksGuest from './BooksGuest';
import BooksAdmin from './BooksAdmin';

/**
 * BooksMain Component
 * Komponen wrapper utama untuk mengelola tampilan antara Guest dan Admin
 * Fungsi: Menampilkan toggle button untuk beralih antar tampilan
 */
const BooksMain = () => {
  // ===== STATE MANAGEMENT =====
  
  // State untuk menyimpan tampilan aktif: 'guest' untuk tampilan user biasa, 'admin' untuk tampilan admin
  const [view, setView] = useState('guest');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ===== TOGGLE BUTTON SECTION ===== */}
      {/* Navigasi dengan 2 tombol untuk beralih antara Guest dan Admin View */}
      <div className="flex justify-center py-4">
        
        {/* Button 1: Guest View - Menampilkan tampilan card untuk pengunjung umum */}
        <button
          onClick={() => setView('guest')} // Set tampilan ke 'guest' saat diklik
          className={`px-4 py-2 mx-2 rounded ${view === 'guest' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Guest View
        </button>
        
        {/* Button 2: Admin View - Menampilkan tampilan tabel untuk admin */}
        <button
          onClick={() => setView('admin')} // Set tampilan ke 'admin' saat diklik
          className={`px-4 py-2 mx-2 rounded ${view === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Admin View
        </button>
      </div>
      
      {/* ===== CONDITIONAL RENDERING ===== */}
      {/* Tampilkan komponen berbeda berdasarkan nilai view state */}
      {view === 'guest' ? <BooksGuest /> : <BooksAdmin />}
    </div>
  );
};

export default BooksMain;