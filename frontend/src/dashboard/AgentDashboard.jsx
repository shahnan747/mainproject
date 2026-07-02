import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../api/api";

export default function AgentDashboard() {
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());
    const [orders, setOrders] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        const fetchOrders = async () => { 
            try { 
                const token = localStorage.getItem("token"); 
                const res = await api.get("/orders", { 
                    headers: { Authorization: `Bearer ${token}`, }, 
                }); 
                
                console.log("ORDERS:", res.data); 
                setOrders(res.data.data || []); 
            } catch (err) { 
                console.error("Failed to fetch orders:", err); 
            } 
            finally { setLoading(false); } 
        }; 
        fetchOrders(); 
    }, []);

    const total = orders.length;

    const delivered = orders.filter(o => o.status === "Delivered").length;

    const pending = orders.filter(o => o.status === "Pending").length;

    // Pre-booking dates 
    const preBookings = orders.map((o) => 
     o.date
        ? new Date(o.date).toISOString().split("T")[0] 
        : null 
    );

    const selectedDate = date.toISOString().split("T")[0];

   const selectedOrders = orders.filter((o) => {  
    if (!o.date) 
        return false; 
    const orderDate = new Date(o.date) .toISOString() .split("T")[0];
    return orderDate === selectedDate; 
   });

   if (loading) {
    return ( 
    <div className="text-white p-6"> 
    Loading dashboard... 
    </div> 
    ); 
 }
    return (
        <div className="text-white p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-yellow-400">Agent Dashboard</h1>

                <button
                    onClick={() => navigate("/order")}
                    className="bg-[#f5c842] text-black px-4 sm:px-5 py-2 rounded-lg font-medium hover:opacity-90 w-full sm:w-auto"
                >
                    + Create Order
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                <div className="bg-white/5 backdrop-blur p-4 sm:p-5 rounded-2xl border border-white/10">
                    <p className="text-white/50 text-sm">Total Orders</p>
                    <h2 className="text-2xl font-bold text-[#f5c842] mt-1">{total}</h2>
                </div>

                <div className="bg-white/5 backdrop-blur p-4 sm:p-5 rounded-2xl border border-white/10">
                    <p className="text-white/50 text-sm">Delivered</p>
                    <h2 className="text-2xl font-bold text-green-400 mt-1">{delivered}</h2>
                </div>

                <div className="bg-white/5 backdrop-blur p-4 sm:p-5 rounded-2xl border border-white/10">
                    <p className="text-white/50 text-sm">Pending</p>
                    <h2 className="text-2xl font-bold text-red-400 mt-1">{pending}</h2>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-4">

                {/* Calendar Section */}
                <div className="bg-white/5 backdrop-blur p-5 rounded-2xl border border-white/10">
                    <h2 className="text-lg font-semibold mb-4">Pre-Booking Calendar</h2>

                    <div className="w-full overflow-x-auto">
                        <Calendar
                            onChange={setDate}
                            value={date}
                            className="!bg-transparent !border-none text-whitew-full "

                            /* Add dot indicator for pre-bookings */
                            tileContent={({ date, view }) => {
                                if (view === "month") {
                                    const d = date.toISOString().split("T")[0];

                                    if (preBookings.includes(d)) {
                                        return (
                                            <div className="flex justify-center mt-1">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            </div>
                                        );
                                    }
                                }
                            }}

                            /* Highlight selected date */
                            tileClassName={({ date }) => {
                                const d = date.toISOString().split("T")[0];
                                const selected = date.toDateString() === new Date().toDateString();

                                if (d === selectedDate) {
                                    return "bg-[#f5c842] text-black rounded-lg";
                                }
                            }}
                        />
                    </div>

                    <button
                        onClick={() =>
                            navigate("/order", { state: { selectedDate } })
                        }
                        className="mt-4 w-full bg-[#f5c842] text-black py-2 text-sm sm:text-base font-medium hover:opacity-90"
                    >
                        ➕ Book Order for {date.toDateString()}
                    </button>


                    {/* Orders on Selected Date */}
                    {selectedOrders.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm mb-2 text-white/70">Orders:</h3>
                            {selectedOrders.map((o, i) => (
                                <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs sm:text-sm text-white/60">
                                    <span className="text-sm break-words">{o.store?.name}</span>
                                    <span className="text-xs text-white/60">₹{o.amount}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="bg-white/5 backdrop-blur p-5 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Recent Orders</h2>
                    </div>

                    {orders.length === 0 ? (
                        <p className="text-white/40">No orders yet</p>
                    ) : (
                        orders.slice(-5).reverse().map((order, index) => (
                            <div
                                key={index}
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-white/5 px-3 sm:px-4 py-3 rounded-lg mb-2"
                            >
                                <div>
                                    <p className="text-sm sm:text-base">{order.store?.name}</p>
                                    <p className="text-xs text-white/40">₹{order.amount}</p>
                                </div>

                                <span
                                    className={`text-xs px-2 sm:px-3 py-1 rounded-full ${order.status === "Delivered"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-yellow-500/20 text-yellow-400"
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}