import React, { useState, useEffect } from 'react';
import booksData from './books.json';

/**
 * BooksAdmin Component
 * Komponen untuk menampilkan daftar buku dalam tampilan Admin dengan table layout
 * Fitur: Search, Filter by Genre, Filter by Year Range, Complex Nested Data Display
 */
const BooksAdmin = () => {
  // ===== STATE MANAGEMENT =====
  
  // State untuk menyimpan daftar buku yang akan ditampilkan di tabel
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
   * useEffect Hook - Handle Filter Logic untuk Admin View
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
      <h1 className="text-3xl font-bold mb-6">Books Collection - Admin View</h1>

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

      {/* ===== BOOKS TABLE DISPLAY SECTION ===== */}
      {/* Tabel responsif dengan scroll horizontal untuk tampilan mobile */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          {/* === TABLE HEADER: Kolom-kolom tabel === */}
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Author</th>
              <th className="border border-gray-300 px-4 py-2">Genre</th>
              <th className="border border-gray-300 px-4 py-2">Published Year</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Pages</th>
              <th className="border border-gray-300 px-4 py-2">Reviews</th>
              <th className="border border-gray-300 px-4 py-2">Metadata</th>
            </tr>
          </thead>
          
          {/* === TABLE BODY: Iterasi data buku dan tampilkan setiap baris === */}
          <tbody>
            {books.map(book => (
              <tr key={book.id} className="hover:bg-gray-50">
                {/* Kolom ID */}
                <td className="border border-gray-300 px-4 py-2">{book.id}</td>
                
                {/* Kolom Image: Tampilkan thumbnail gambar buku */}
                <td className="border border-gray-300 px-4 py-2">
                  <img src={book.imageUrl} alt={book.title} className="w-16 h-16 object-cover" />
                </td>
                
                {/* Kolom Title: Judul buku */}
                <td className="border border-gray-300 px-4 py-2">{book.title}</td>
                
                {/* Kolom Author: Nested data - Nama dan Bio Penulis */}
                <td className="border border-gray-300 px-4 py-2">
                  {book.author.name} <br />
                  <small className="text-gray-500">{book.author.bio}</small>
                </td>
                
                {/* Kolom Genre */}
                <td className="border border-gray-300 px-4 py-2">{book.genre}</td>
                
                {/* Kolom Published Year */}
                <td className="border border-gray-300 px-4 py-2">{book.publishedYear}</td>
                
                {/* Kolom Price */}
                <td className="border border-gray-300 px-4 py-2">${book.price}</td>
                
                {/* Kolom Description */}
                <td className="border border-gray-300 px-4 py-2">{book.description}</td>
                
                {/* Kolom Pages */}
                <td className="border border-gray-300 px-4 py-2">{book.pages}</td>
                
                {/* Kolom Reviews: Nested data - Array dari review objects */}
                <td className="border border-gray-300 px-4 py-2">
                  {/*  Iterasi melalui setiap review dan tampilkan */}
                  {book.reviews.map((review, index) => (
                    <div key={index} className="mb-1">
                      <strong>{review.user}:</strong> {review.rating}/5 - {review.comment}
                    </div>
                  ))}
                </td>
                
                {/* Kolom Metadata: Nested data - Publisher dan ISBN */}
                <td className="border border-gray-300 px-4 py-2">
                  Publisher: {book.metadata.publisher} <br />
                  ISBN: {book.metadata.isbn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BooksAdmin;