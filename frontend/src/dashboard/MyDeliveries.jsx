import { useState, useEffect } from "react";
import { fetchOrders, updateOrderStatus } from "../services/deliveryService";

export default function MyDeliveries() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await fetchOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };

    //Group orders by route
    const groupedRoutes = {};
    orders
        .filter(order => order.route)
        .forEach(order => {
            if (!groupedRoutes[order.route]) {
                groupedRoutes[order.route] = [];
            }
            groupedRoutes[order.route].push(order);
        });

    const markDelivered = async (id) => {
        try {
            await updateOrderStatus(id, "delivered");

            const data = await fetchOrders();
            setOrders(data);

        } catch (error) {
            console.error(error);
            alert("Failed to mark as delivered");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white px-3 sm:px:6 py-4 flex flex-col items-center">

            {/* Header */}
            <h1 className="text-xl sm:text-2xl font-semibold text-yellow-400 mb-6 text-center">
                My Deliveries
            </h1>

            <div className="w-full max-w-4xl p-3 mx-auto mt-4">
                {/* No Data */}
                {Object.keys(groupedRoutes).length === 0 ? (
                    <p className="text-white/40">No deliveries assigned</p>
                ) : (
                    Object.keys(groupedRoutes).map((route, idx) => (
                        <div
                            key={idx}
                            className="mb-6 bg-white/5 backdrop-blur px-3 sm:px-5 py-4 rounded-2xl border border-white/10 shadow-lg"
                        >
                            {/* 🚚 Route Header */}
                            <h2 className="text-lg font-semibold text-yellow-400 mb-4">
                                🚚 Route: {route}
                            </h2>

                            {/* Stores */}
                            <div className="space-y-3">
                                {groupedRoutes[route].map((order) => (
                                    <div
                                        key={order._id}
                                        className="flex flex-col mx-1 sm:mx-0 sm:flex-row sm:justify-between sm:items-center gap-3 bg-white/5 px-3 sm:px-4 py-3 rounded-xl border border-white/5 hover:bg-white/10 transition"
                                    >
                                        {/* LEFT */}
                                        <div className="w-full sm:w-auto">
                                            <p className="text-sm sm:text-base font-medium">
                                                {order.storeId?.name}
                                            </p>

                                            <p className="text-xs sm:text-sm text-white/50 break-words">
                                                {order.items
                                                    ?.map(item => item.productId?.name)
                                                    .join(", ") || "No items"}
                                            </p>
                                        </div>

                                        {/* RIGHT */}
                                        <button
                                            onClick={() => markDelivered(order._id)}
                                            disabled={order.status === "delivered"}
                                            className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${order.status === "Delivered"
                                                ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                                                : "bg-yellow-400 text-black hover:bg-yellow-300"
                                                }`}
                                        >
                                            {order.status === "delivered"
                                                ? "Delivered"
                                                : "Mark Delivered"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}