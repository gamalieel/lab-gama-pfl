import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmail, getMyProfile } from "../../lib/supabase";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

export default function Login() {
    /* navigate, state & handleChange*/
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataForm, setDataForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

    /* process form - Supabase Auth login */
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            await signInWithEmail(dataForm.email, dataForm.password);
            const profile = await getMyProfile();

            if (profile && profile.role === "Guest") {
                setError("Akun Guest tidak dapat mengakses dashboard.");
                setLoading(false);
                return;
            }

            navigate("/");
        } catch (err) {
            setError(err.message || "Login gagal. Periksa email dan password Anda.");
        } finally {
            setLoading(false);
        }
    };

    	/* error & loading status */
		const errorInfo = error ? (
		    <div className="bg-red-200 mb-5 p-5 text-sm font-light text-gray-600 rounded flex items-center">
		        <BsFillExclamationDiamondFill className="text-red-600 me-2 text-lg" />
		        {error}
		    </div>
		) : null
		
		const loadingInfo = loading ? (
		    <div className="bg-gray-200 mb-5 p-5 text-sm rounded flex items-center">
		        <ImSpinner2 className="me-2 animate-spin" />
		        Mohon Tunggu...
		    </div>
		) : null
        
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                Welcome Back 👋
            </h2>

            {errorInfo}
            {loadingInfo}

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        value={dataForm.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm
                            placeholder-gray-400"
                        placeholder="you@example.com"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={dataForm.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm
                            placeholder-gray-400"
                        placeholder="********"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4
                        rounded-lg transition duration-300"
                >
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    );
}
