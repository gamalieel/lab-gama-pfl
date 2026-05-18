/**
 * InputField Component
 * Komponen reusable untuk input field dengan validasi dan error message
 */
export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <div className="mb-4">
      {/* Label untuk input field */}
      <label className="block text-gray-700 font-medium mb-1">{label}</label>

      {/* Input element dengan styling dan event handler */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded transition-colors ${
          error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
        } focus:ring-2 focus:outline-none`}
      />

      {/* Tampilkan error message jika ada error */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}