import { useState } from "react";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";

export default function UserForm() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  // State untuk menyimpan data form input
  const [form, setForm] = useState({
    nama: "",
    email: "",
    umur: "",
    jenisKelamin: "",
    kota: "",
  });

  // State untuk menyimpan error message di setiap field
  const [errors, setErrors] = useState({
    nama: "",
    email: "",
    umur: "",
    jenisKelamin: "",
    kota: "",
  });

  // State untuk menampilkan data yang sudah disubmit
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // ============================================
  // VALIDATION FUNCTIONS
  // ============================================

  /**
   * Fungsi validasi untuk Nama
   * Validasi: required (tidak boleh kosong) + tidak boleh mengandung angka
   */
  const validateNama = (value) => {
    if (!value.trim()) {
      return "Nama tidak boleh kosong";
    }
    if (/\d/.test(value)) {
      return "Nama tidak boleh mengandung angka";
    }
    return "";
  };

  /**
   * Fungsi validasi untuk Email
   * Validasi: required (tidak boleh kosong) + format email harus valid
   */
  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Email tidak boleh kosong";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Format email tidak valid";
    }
    return "";
  };

  /**
   * Fungsi validasi untuk Umur
   * Validasi: required (tidak boleh kosong) + harus berupa angka + harus diantara 1-100
   */
  const validateUmur = (value) => {
    if (!value.trim()) {
      return "Umur tidak boleh kosong";
    }
    if (!/^\d+$/.test(value)) {
      return "Umur harus berupa angka";
    }
    const umurNum = parseInt(value);
    if (umurNum < 1 || umurNum > 100) {
      return "Umur harus diantara 1-100";
    }
    return "";
  };

  /**
   * Fungsi validasi untuk Jenis Kelamin
   * Validasi: harus dipilih (tidak boleh kosong)
   */
  const validateJenisKelamin = (value) => {
    if (!value) {
      return "Jenis kelamin harus dipilih";
    }
    return "";
  };

  /**
   * Fungsi validasi untuk Kota
   * Validasi: harus dipilih (tidak boleh kosong)
   */
  const validateKota = (value) => {
    if (!value) {
      return "Kota harus dipilih";
    }
    return "";
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Handler ketika input field berubah
   * Fungsi: update state form dan update error message secara real-time
   */
  const handleInputChange = (field, value) => {
    // Update form data
    setForm({
      ...form,
      [field]: value,
    });

    // Real-time validation: hapus error jika user sudah mulai mengetik
    let newError = "";
    if (field === "nama") {
      newError = validateNama(value);
    } else if (field === "email") {
      newError = validateEmail(value);
    } else if (field === "umur") {
      newError = validateUmur(value);
    } else if (field === "jenisKelamin") {
      newError = validateJenisKelamin(value);
    } else if (field === "kota") {
      newError = validateKota(value);
    }

    // Update error state
    setErrors({
      ...errors,
      [field]: newError,
    });
  };

  /**
   * Fungsi untuk mengecek apakah semua validasi sudah lolos
   * Return: true jika semua field valid, false jika ada yang error
   */
  const isFormValid = () => {
    return (
      form.nama.trim() !== "" &&
      form.email.trim() !== "" &&
      form.umur.trim() !== "" &&
      form.jenisKelamin !== "" &&
      form.kota !== "" &&
      !errors.nama &&
      !errors.email &&
      !errors.umur &&
      !errors.jenisKelamin &&
      !errors.kota
    );
  };

  /**
   * Handler ketika tombol submit dklik
   * Fungsi: tampilkan data yang sudah diinput
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Cek ulang semua validasi sebelum submit
    const namaError = validateNama(form.nama);
    const emailError = validateEmail(form.email);
    const umurError = validateUmur(form.umur);
    const jenisKelaminError = validateJenisKelamin(form.jenisKelamin);
    const kotaError = validateKota(form.kota);

    // Update errors state
    setErrors({
      nama: namaError,
      email: emailError,
      umur: umurError,
      jenisKelamin: jenisKelaminError,
      kota: kotaError,
    });

    // Jika ada error, jangan submit
    if (
      namaError ||
      emailError ||
      umurError ||
      jenisKelaminError ||
      kotaError
    ) {
      return;
    }

    // Jika semua valid, tampilkan data yang disubmit
    setSubmitted(true);
    setSubmittedData(form);
  };

  /**
   * Handler untuk reset form
   * Fungsi: bersihkan semua data form dan error message
   */
  const handleReset = () => {
    setForm({
      nama: "",
      email: "",
      umur: "",
      jenisKelamin: "",
      kota: "",
    });
    setErrors({
      nama: "",
      email: "",
      umur: "",
      jenisKelamin: "",
      kota: "",
    });
    setSubmitted(false);
    setSubmittedData(null);
  };

  // ============================================
  // OPTIONS DATA
  // ============================================

  // Data untuk select dropdown Jenis Kelamin
  const jenisKelaminOptions = [
    { value: "laki-laki", label: "Laki-laki" },
    { value: "perempuan", label: "Perempuan" },
    { value: "perempuan", label: "Netral" },
  ];

  // Data untuk select dropdown Kota
  const kotaOptions = [
    { value: "jakarta", label: "Rumbai" },
    { value: "bandung", label: "Bangkinang" },
    { value: "surabaya", label: "PCR" },
    { value: "yogyakarta", label: "KartikaSari" },
    { value: "medan", label: "Indonesia" },
  ];

  // ============================================
  // RENDER COMPONENT
  // ============================================

  return (
    <div className="flex flex-col items-center justify-center min-h-screen m-5 p-5 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* FORM HEADER */}
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Tambah User
        </h2>

        {/* FORM ELEMENT */}
        <form onSubmit={handleSubmit}>
          {/* INPUT FIELD: NAMA */}
          <InputField
            label="Nama (Tidak boleh angka)"
            type="text"
            placeholder="Contoh: UjangBoy"
            value={form.nama}
            onChange={(e) => handleInputChange("nama", e.target.value)}
            error={errors.nama}
          />

          {/* INPUT FIELD: EMAIL */}
          <InputField
            label="Email (Format valid diperlukan)"
            type="email"
            placeholder="Contoh: UjangBoy@gmail.com"
            value={form.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
          />

          {/* INPUT FIELD: UMUR */}
          <InputField
            label="Umur (Hanya angka, 1-100)"
            type="text"
            placeholder="Contoh: 78"
            value={form.umur}
            onChange={(e) => handleInputChange("umur", e.target.value)}
            error={errors.umur}
          />

          {/* SELECT FIELD: JENIS KELAMIN */}
          <SelectField
            label="Kelamin Saat Ini"
            value={form.jenisKelamin}
            onChange={(e) =>
              handleInputChange("jenisKelamin", e.target.value)
            }
            options={jenisKelaminOptions}
            error={errors.jenisKelamin}
          />

          {/* SELECT FIELD: KOTA */}
          <SelectField
            label="Kota"
            value={form.kota}
            onChange={(e) => handleInputChange("kota", e.target.value)}
            options={kotaOptions}
            error={errors.kota}
          />

          {/* BUTTONS CONTAINER */}
          <div className="flex gap-3">
            {/* SUBMIT BUTTON - hanya tampil jika semua field valid */}
            {isFormValid() && (
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold p-3 rounded transition-colors"
              >
                Simpan
              </button>
            )}

            {/* RESET BUTTON - untuk clear form */}
            <button
              type="button"
              onClick={handleReset}
              className={`flex-1 ${
                isFormValid() ? "bg-gray-400" : "bg-gray-400"
              } hover:bg-gray-500 text-white font-semibold p-3 rounded transition-colors`}
            >
              Ulang
            </button>
          </div>

          {/* INFO MESSAGE - jika belum semua valid */}
          {!isFormValid() && (
            <p className="text-center text-gray-500 text-sm mt-4">
              Wajib di isi bray baru bisa submit yee
            </p>
          )}
        </form>

        {/* ============================================ */}
        {/* HASIL SUBMIT - tampil jika sudah disubmit */}
        {/* ============================================ */}
        {submitted && submittedData && (
          <div className="mt-8 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
            <h3 className="text-lg font-bold text-green-700 mb-4">
              ✓ Data Berhasil Disimpan
            </h3>

            {/* Tampilkan semua data yang disubmit */}
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Nama:</span> {submittedData.nama}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {submittedData.email}
              </p>
              <p>
                <span className="font-semibold">Umur:</span> {submittedData.umur}{" "}
                tahun
              </p>
              <p>
                <span className="font-semibold">Jenis Kelamin:</span>{" "}
                {submittedData.jenisKelamin === "laki-laki"
                  ? "Laki-laki"
                  : "Perempuan"}
              </p>
              <p>
                <span className="font-semibold">Kota:</span>{" "}
                {submittedData.kota.charAt(0).toUpperCase() +
                  submittedData.kota.slice(1)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}