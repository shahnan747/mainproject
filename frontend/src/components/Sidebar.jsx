import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const location = useLocation();
    const navigate = useNavigate();

    const menu = {
        admin: [
            { name: "Dashboard", path: "/dashboard" },
            { name: "Agent", path: "/agentdashboard" },
            { name: "Delivery", path: "/deliverydashboard" },
            { name: "Stores", path: "/stores" },
            { name: "Assign Orders", path: "/assign" },
            { name: "Analytics", path: "/analytics" },
            { name: "AI Suggest", path: "/ai" }, 
        ],
        field_agent: [
            { name: "Dashboard", path: "/agentdashboard" },
            { name: "Create Order", path: "/order" },
            { name: "Order History", path: "/history" },
            { name: "AI Suggest", path: "/ai" }, 
        ],
        delivery_personnel: [
            { name: "Dashboard", path: "/deliverydashboard" },
            { name: "My Deliveries", path: "/deliveries" },
        ],
    };

    const currentMenu = menu[user?.role] || [];

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/login");
    };

    return (
        <>
            {/*Hamburger Button  */}
            <button
                className="md:hidden fixed top-2 left-2 z-[60] 
            bg-[#0a0f1e] border border-white/10 
            text-white text-lg 
            p-1.5 rounded-lg shadow-lg 
            hover:bg-[#111d3e] active:scale-95 transition"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                ☰
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 left-0 h-full w-64 bg-[#0a0f1e] border-r border-white/10 p-5 
    transform transition-transform z-[60]
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0`}
            >

                {/* Logo */}
                <div className="flex items-center gap-2 pb-4">
                    <div className="w-9 h-8 rounded-lg flex items-center justify-center bg-white overflow-hidden">
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

                {/* Menu */}
                <div className="flex flex-col gap-2">
                    {currentMenu.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`px-4 py-2 rounded-lg text-sm transition ${location.pathname === item.path
                                ? "bg-[#f5c842] text-black"
                                : "text-white/60 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg"
                >
                    Logout
                </button>
            </div>
        </>
    );
}