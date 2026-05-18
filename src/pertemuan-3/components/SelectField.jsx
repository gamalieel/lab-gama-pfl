/**
 * SelectField Component
 * Komponen reusable untuk select/dropdown field dengan validasi dan error message
 */
export default function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = "Pilih salah satu...",
}) {
  return (
    <div className="mb-4">
      {/* Label untuk select field */}
      <label className="block text-gray-700 font-medium mb-1">{label}</label>

      {/* Select element dengan styling dan event handler */}
      <select
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded transition-colors ${
          error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
        } focus:ring-2 focus:outline-none`}
      >
        {/* Default placeholder option */}
        <option value="">{placeholder}</option>

        {/* Map semua options yang diberikan */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Tampilkan error message jika ada error */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
