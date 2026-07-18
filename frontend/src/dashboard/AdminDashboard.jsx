import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminOrders } from "../services/adminService";
import socket from "../socket";

export default function AdminDashboard() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const loadOrders = async () => {

        try {

            setLoading(true);
            const data = await fetchAdminOrders();

            setOrders(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {

        socket.on("newOrder", (data) => {

            setNotifications(prev => [
                {
                    id: Date.now(),
                    message: data.message,
                    time: new Date().toLocaleTimeString()
                },
                ...prev
            ]);
            console.log("📦 New order received");
            loadOrders();
        });

        socket.on("statusUpdated", (data) => {

            setNotifications(prev => [
                {
                    id: Date.now(),
                    message: `Order status changed to ${data.status}`,
                    time: new Date().toLocaleTimeString()
                },
                ...prev
            ]);
            console.log("🚚 Status updated");
            loadOrders();
        });

        socket.on("orderAssigned", () => {

            setNotifications(prev => [
                {
                    id: Date.now(),
                    message: "Order assigned successfully",
                    time: new Date().toLocaleTimeString()
                },
                ...prev
            ]);

            console.log("✅ Order assigned");
            loadOrders();
        });

        return () => {
            socket.off("newOrder");
            socket.off("statusUpdated");
            socket.off("orderAssigned");
        };

    }, []);

    const totalOrders = orders.length;


    const revenue = orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
    );


    const profit = revenue * 0.1;

    return (
        <div className="flex min-h-screen bg-[#0a0f1e] text-white">
            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">

                    <h1 className="text-xl sm:text-2xl font-semibold text-yellow-400">
                        Dashboard
                    </h1>

                    <div className="relative">

                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="text-3xl"
                        >
                            🔔
                        </button>

                        {notifications.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                {notifications.length}
                            </span>
                        )}

                        {
                            showNotifications && (

                                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[#111827] rounded-xl shadow-2xl border border-white/10 z-50">
                                    <div className="flex justify-between items-center p-3 border-b border-white/10">
                                        <h2 className="font-semibold">Notifications</h2>

                                        <button
                                            onClick={() => setNotifications([])}
                                            className="text-xs text-red-400 hover:text-red-300"
                                        >
                                            Clear All
                                        </button>
                                    </div>

                                    {
                                        notifications.length === 0
                                            ? <p className="text-gray-400 text-center py-6">
                                                No notifications yet
                                            </p>

                                            : notifications.map(item => (

                                                <div
                                                    key={item.id}
                                                    className="p-3 border-b border-white/10 hover:bg-white/5 transition"
                                                >
                                                    <p>{item.message}</p>
                                                    <small className="text-gray-400">
                                                        {item.time}
                                                    </small>
                                                </div>

                                            ))
                                    }

                                </div>

                            )}


                    </div>


                </div>


                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-6">
                    <Card title="Orders" value={totalOrders} />
                    <Card title="Revenue" value={`₹${revenue.toFixed(2)}`} />
                    <Card title="Profit" value={`₹${profit.toFixed(2)}`} />
                </div>

                {/* Orders Table */}
                <div className="bg-[#111827] rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-semibold mb-4 text-orange-300">Orders</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="text-gray-400 border-b border-white/10">
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm">Store</th>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm">Amount</th>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm">Status</th>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm">Assign</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm">{order.storeId?.name}</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm">₹{order.totalAmount}</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm">
                                            <span
                                                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm ${order.status === "collected" || order.status === "draft"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-yellow-500/20 text-yellow-400"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {order.status === "collected" || order.status === "draft" ? (
                                                <button
                                                    onClick={() => navigate("/assign", { state: { order } })}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition"
                                                >
                                                    Assign
                                                </button>
                                            ) : (
                                                <div className="flex flex-col gap-1">
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                                        {order.deliveryPerson || "Assigned"}
                                                    </span>
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                        {order.route || "No Route"}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

function Card({ title, value }) {
    return (
        <div className="bg-[#111827] p-4 sm:p-6 rounded-2xl shadow-md hover:scale-105 transition">
            <h3 className="text-gray-300">{title}</h3>
            <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
    );
}
