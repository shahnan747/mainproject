import { useState } from "react";
import api from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/forgotpassword", {
        email,
      });

      setMessage(res.data.message || "Reset link sent");
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to send reset email"
      );

      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 backdrop-blur p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-white/10 text-white outline-none"
        />

        {message && (
          <p className="text-green-400 text-sm mb-4">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        <button className="w-full bg-[#f5c842] text-black py-3 rounded-lg font-semibold hover:bg-yellow-300 transition">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

