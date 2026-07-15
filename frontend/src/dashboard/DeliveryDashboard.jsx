import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import { fetchOrders } from "../services/deliveryService";


export default function DeliveryDashboard() {
    const [date, setDate] = useState(new Date());

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchOrders();
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    // Stats
    const total = orders.length;
    const delivered = orders.filter(o => o.status === "delivered").length;
    const assigned = orders.filter(o => o.status === "assigned").length;

    const routeDates = orders
        .filter(o => o.orderDate)
        .map(o =>
            new Date(o.orderDate)
                .toISOString()
                .split("T")[0]
        );

    const selectedDate = date.toISOString().split("T")[0];

    const selectedRoutes = orders.filter(o =>
        o.orderDate &&
        new Date(o.orderDate)
            .toISOString()
            .split("T")[0] === selectedDate
    );

    const deliveredCount = selectedRoutes.filter(
        order => order.status === "delivered"
    ).length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
                <p className="text-yellow-400 text-lg font-medium">
                    Loading deliveries...
                </p>
            </div>
        );
    }

    return (
        <div className="text-white p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-yellow-400">Delivery Dashboard</h1>

                <button
                    onClick={() => navigate("/deliveries")}
                    className="bg-[#f5c842] text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 w-full sm:w-auto"                >
                    My Deliveries
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                <div className="bg-white/5 backdrop-blur p-4 sm:p-5 rounded-2xl border border-white/10">
                    <p className="text-white text-sm">Total Orders</p>
                    <h2 className="text-2xl font-bold text-[#f5c842] mt-1">{total}</h2>
                </div>

                <div className="bg-white/5 backdrop-blur p-4 sm:p-5 rounded-2xl border border-white/10">
                    <p className="text-white text-sm">Assigned Routes</p>
                    <h2 className="text-2xl font-bold text-blue-400 mt-1">{assigned}</h2>
                </div>

                <div className="bg-white/5 backdrop-blur p-4 sm:p-5 rounded-2xl border border-white/10">
                    <p className="text-white text-sm">Delivered</p>
                    <h2 className="text-2xl font-bold text-green-400 mt-1">{delivered}</h2>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-4">

                {/* Calendar */}
                <div className="bg-white/5 backdrop-blur p-5 rounded-2xl border border-white/10">
                    <h2 className="text-lg font-semibold mb-4">Route Calendar</h2>

                    <div className="w-full overflow-x-auto">
                        <Calendar
                            onChange={setDate}
                            value={date}
                            className="!bg-transparent !border-none text-white w-full max-w-full"

                            /* Show route assigned dates */
                            tileContent={({ date, view }) => {
                                if (view !== "month") return null;

                                const currentDate = date.toISOString().split("T")[0];

                                const dayOrders = orders.filter(
                                    order =>
                                        order.orderDate &&
                                        new Date(order.orderDate)
                                            .toISOString()
                                            .split("T")[0] === currentDate
                                );

                                if (dayOrders.length === 0) return null;

                                const allDelivered = dayOrders.every(
                                    order => order.status === "delivered"
                                );

                                return (
                                    <div className="flex justify-center mt-1">
                                        <div
                                            className={`w-2 h-2 rounded-full ${allDelivered
                                                ? "bg-green-400"
                                                : "bg-blue-400"
                                                }`}
                                        />
                                    </div>
                                );
                            }}

                            /* Highlight selected date */
                            tileClassName={({ date }) => {
                                const d = date.toISOString().split("T")[0];

                                if (d === selectedDate) {
                                    return "bg-[#f5c842] text-black rounded-lg";
                                }
                            }}
                        />
                    </div>

                    {/* Selected Date Routes */}
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm text-white/70">
                                Routes on {date.toDateString()}
                            </h3>

                            {selectedRoutes.length > 0 && (
                                <span className="text-green-400 text-sm font-medium">
                                    {deliveredCount} / {selectedRoutes.length} Delivered
                                </span>
                            )}
                        </div>

                        {selectedRoutes.length === 0 ? (
                            <p className="text-white/40 text-sm">
                                No routes assigned
                            </p>
                        ) : (
                            selectedRoutes.map((o, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm text-white/70 mb-2"
                                >
                                    <span>
                                        {o.status === "delivered" ? "✅" : "🚚"}{" "}
                                        {o.storeId?.name}
                                    </span>
                                    <span className="text-blue-400">{o.route}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Assigned Deliveries */}
                <div className="bg-white/5 backdrop-blur p-5 rounded-2xl border border-white/10">
                    <h2 className="text-lg font-semibold mb-4">Assigned Deliveries</h2>

                    {orders.filter(o => o.route).length === 0 ? (
                        <p className="text-white/40">No deliveries assigned</p>
                    ) : (
                        orders
                            .filter(o => o.route)
                            .slice(-5)
                            .reverse()
                            .map((order) => (
                                <div
                                    key={order._id}
                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-white/5 px-3 sm:px-4 py-3 rounded-lg mb-2"
                                >
                                    <div>
                                        <p className="text-sm sm:text-base">{order.storeId?.name}</p>
                                        <p className="text-xs text-white/40">
                                            ₹{order.totalAmount}
                                        </p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p className="text-xs sm:text-sm text-blue-400">
                                            {order.route}
                                        </p>
                                        <span
                                            className={`text-xs px-2 sm:px-3 py-1 rounded-full ${order.status === "delivered"
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-yellow-500/20 text-yellow-400"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                    )}
                </div>

            </div>
        </div>
    );
}