export default function Badge({ children, type = "primary" }) {
    const types = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-600 hover:bg-gray-700 text-white",
        success: "bg-green-600 hover:bg-green-700 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    };
	return (
        <span className={`${types[type]} pbg-green-100 text-green-700 px-3 py-1 rounded-full text-sm`}>
                {children}
        </span>
	  );
}