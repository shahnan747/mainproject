import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateLogin } from "../utils/Validations";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      // Save JWT Token
      localStorage.setItem("token", res.data.token);

      // Save logged in user
      localStorage.setItem(
        "currentUser",
        JSON.stringify(res.data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      setLoginError(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

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
          Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-3 rounded-lg bg-white/10 text-white outline-none"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        {errors.email && (
          <p className="text-red-400 text-xs mb-3">{errors.email}</p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-2 p-3 rounded-lg bg-white/10 text-white outline-none"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        {errors.password && (
          <p className="text-red-400 text-xs mb-3">
            {errors.password}
          </p>
        )}

        <div className="text-right mb-4">
          <span onClick={() => navigate("/forgot-password")}
            className="text-sm text-[#f5c842] cursor-pointer hover:underline" >
            Forgot Password?
          </span>
        </div>

        {/* Login Error */}
        {loginError && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {loginError}
          </p>
        )}

        {/* Button */}
        <button className="w-full bg-[#f5c842] text-[#0a0f1e] py-3 rounded-lg font-semibold hover:bg-yellow-300 transition">
          Login
        </button>


        {/* Signup link */}
        <p className="text-white/50 text-sm mt-4 text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#f5c842] cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}