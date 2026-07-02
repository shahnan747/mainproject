import { useState } from "react";
import { validateSignup } from "../utils/Validations";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function SignUp() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "select role",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateSignup(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            const res = await api.post("/auth/register", {
                name: form.name, 
                email: form.email, 
                password: form.password,
                confirmPassword: form.confirmPassword, 
                role: form.role,
            });
            
            console.log("Signup Success", res.data);

            navigate("/login");
        }catch(err) {
            console.error(err);

           setErrors({
            api: err.response?.data?.message || "Signup failed",
           });
        }
       
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white/5 border border-white/10 backdrop-blur p-8 rounded-2xl w-full max-w-md"
            >
                <p onClick={() => navigate("/")} className="text-yellow-400 text-sm cursor-pointer hover:text-[#f5c842] mb-6" > 
                    Back 
                </p>
                
                <h2 className="text-white text-2xl font-bold mb-6 text-center">
                    Sign Up
                </h2>

                {/* Name */}
                <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    className="w-full mb-2 p-3 rounded-lg bg-white/10 text-white"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <p className="text-red-400 text-xs mb-3">{errors.name}</p>}

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    className="w-full mb-2 p-3 rounded-lg bg-white/10 text-white"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <p className="text-red-400 text-xs mb-3">{errors.email}</p>}

                {/* Role */}
                <div className="relative">
                    <select
                        value={form.role}
                        className="w-full mb-2 p-3 rounded-lg bg-white/10 text-white appearance-none"
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                        <option value="" className="text-black">Select Role</option>
                        <option value="admin" className="text-black">Administrator</option>
                        <option value="field_agent" className="text-black">Field Sales Agent</option>
                        <option value="delivery_personnel" className="text-black">Delivery Personnel</option>
                    </select>

                    {/* Dropdown arrow */}
                    <div className="absolute right-3 top-3 pointer-events-none text-white">
                        ▼
                    </div>
                </div>

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    className="w-full mb-2 p-3 rounded-lg bg-white/10 text-white"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {errors.password && <p className="text-red-400 text-xs mb-3">{errors.password}</p>}

                {/* Confirm Password */}
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    className="w-full mb-2 p-3 rounded-lg bg-white/10 text-white"
                    onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                    }
                />
                {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mb-4">
                        {errors.confirmPassword}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-300">
                    Sign Up
                </button>

                <p className="text-sm text-center text-gray-400 mt-4">
                    Already have an account?
                    <span
                        onClick={() => navigate("/login")}
                        className="text-yellow-400 cursor-pointer ml-1"
                    >
                        Login
                    </span>
                </p>


            </form>
        </div>
    );
}
