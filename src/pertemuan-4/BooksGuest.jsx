import React, { useState, useEffect } from 'react';
import booksData from './books.json';

/**
 * BooksGuest Component
 * Komponen untuk menampilkan daftar buku dalam tampilan Guest dengan card layout yang menarik
 * Fitur: Search, Filter by Genre, Filter by Year Range
 */
const BooksGuest = () => {
  // ===== STATE MANAGEMENT =====
  
  // State untuk menyimpan daftar buku yang akan ditampilkan
  const [books, setBooks] = useState(booksData);
  
  // State untuk menyimpan nilai pencarian (berdasarkan judul atau nama penulis)
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk menyimpan genre yang dipilih sebagai filter
  const [selectedGenre, setSelectedGenre] = useState('');
  
  // State untuk menyimpan tahun minimum untuk filter rentang tahun
  const [minYear, setMinYear] = useState('');
  
  // State untuk menyimpan tahun maksimum untuk filter rentang tahun
  const [maxYear, setMaxYear] = useState('');

  /**
   * useEffect Hook - Handle Filter Logic
   * Fungsi: Menjalankan filter setiap kali ada perubahan pada search term atau filter
   * Dependencies: searchTerm, selectedGenre, minYear, maxYear
   */
  useEffect(() => {
    let filteredBooks = booksData;

    // === Filter 1: Pencarian berdasarkan Judul atau Nama Penulis ===
    if (searchTerm) {
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // === Filter 2: Pencarian berdasarkan Genre ===
    if (selectedGenre) {
      filteredBooks = filteredBooks.filter(book => book.genre === selectedGenre);
    }

    // === Filter 3: Pencarian berdasarkan Tahun Minimum ===
    if (minYear) {
      filteredBooks = filteredBooks.filter(book => book.publishedYear >= parseInt(minYear));
    }
    
    // === Filter 4: Pencarian berdasarkan Tahun Maksimum ===
    if (maxYear) {
      filteredBooks = filteredBooks.filter(book => book.publishedYear <= parseInt(maxYear));
    }

    // Update state dengan hasil filter
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooks(filteredBooks);
  }, [searchTerm, selectedGenre, minYear, maxYear]);

  /**
   * Ekstrak semua genre unik dari data buku untuk dropdown filter
   * Menggunakan Set untuk menghilangkan duplikat genre
   */
  const genres = [...new Set(booksData.map(book => book.genre))];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Books Collection - Guest View</h1>

      {/* ===== SEARCH & FILTER SECTION ===== */}
      <div className="mb-6">
        {/* === SEARCH INPUT: Pencarian berdasarkan Judul atau Nama Penulis === */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm saat user mengetik
            className="border border-gray-300 rounded px-4 py-2 flex-1 min-w-64"
          />
        </div>
        
        {/* === FILTER CONTROLS: Genre dan Tahun Publikasi === */}
        <div className="flex flex-wrap gap-4">
          {/* Filter 1: Genre Dropdown */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)} // Update selectedGenre saat dipilih
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="">All Genres</option>
            {/* Render semua genre yang unik dari data */}
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          
          {/* Filter 2: Minimum Year Input */}
          <input
            type="number"
            placeholder="Min Year"
            value={minYear}
            onChange={(e) => setMinYear(e.target.value)} // Update minYear saat user mengetik
            className="border border-gray-300 rounded px-4 py-2 w-32"
          />
          
          {/* Filter 3: Maximum Year Input */}
          <input
            type="number"
            placeholder="Max Year"
            value={maxYear}
            onChange={(e) => setMaxYear(e.target.value)} // Update maxYear saat user mengetik
            className="border border-gray-300 rounded px-4 py-2 w-32"
          />
        </div>
      </div>

      {/* ===== BOOKS CARDS DISPLAY SECTION ===== */}
      {/* Grid responsive: 1 kolom mobile, 2 kolom tablet, 3 kolom desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Iterasi melalui setiap buku dan tampilkan dalam format card */}
        {books.map(book => (
          <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* === BOOK IMAGE: Tampilkan gambar buku === */}
            <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-cover" />
            
            {/* === BOOK DETAILS CARD BODY === */}
            <div className="p-4">
              {/* Judul Buku */}
              <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
              
              {/* Nama Penulis */}
              <p className="text-gray-600 mb-2">By {book.author.name}</p>
              
              {/* Genre dan Tahun Publikasi */}
              <p className="text-sm text-gray-500 mb-2">{book.genre} - {book.publishedYear}</p>
              
              {/* Harga Buku */}
              <p className="text-lg font-bold text-green-600 mb-2">${book.price}</p>
              
              {/* Deskripsi Buku */}
              <p className="text-sm text-gray-700 mb-2">{book.description}</p>
              
              {/* Jumlah Halaman */}
              <p className="text-sm text-gray-500">Pages: {book.pages}</p>
              
              {/* === REVIEWS SECTION: Tampilkan ulasan pembaca === */}
              <div className="mt-2">
                <h3 className="text-sm font-semibold">Reviews:</h3>
                {/* Iterasi melalui setiap review dan tampilkan */}
                {book.reviews.map((review, index) => (
                  <div key={index} className="text-xs text-gray-600 mt-1">
                    <span className="font-medium">{review.user}:</span> {review.rating}/5 - {review.comment}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksGuest;