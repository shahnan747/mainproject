import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#0a0f1ef7] backdrop-blur border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                        <img
                            src={logo}
                            alt="FieldHub Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <span className="text-white font-bold text-lg">
                        Field<span className="text-[#f5c842]">Hub</span>
                    </span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-8 text-white/70 text-sm">
                    <a href="#">Home</a>
                    <a href="#features">Features</a>
                    <a href="#about">About</a>
                    <a href="#product">Products</a>
                </div>

                {/* Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/login" className="text-white/70 text-sm">
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="bg-[#f5c842] text-black px-5 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-400"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Hamburger Button */}
                <button
                    className="md:hidden text-white text-2xl"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-6 pb-6 bg-[#0a0f1e] border-t border-white/10">
                    <div className="flex flex-col gap-4 text-white/80 text-sm mt-4">
                        <a href="#" onClick={() => setIsOpen(false)}>Home</a>
                        <a href="#features" onClick={() => setIsOpen(false)}>Features</a>
                        <a href="#about" onClick={() => setIsOpen(false)}>About</a>
                        <a href="#product" onClick={() => setIsOpen(false)}>Products</a>

                        <hr className="border-white/10 my-2" />

                        <Link to="/login" onClick={() => setIsOpen(false)}>
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            onClick={() => setIsOpen(false)}
                            className="bg-[#f5c842] text-black px-4 py-2 rounded-lg text-center font-semibold"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}