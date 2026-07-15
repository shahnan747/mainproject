import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminOrders } from "../services/adminService";

export default function AdminDashboard() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadOrders = async () => {

            try {

                const data = await fetchAdminOrders();

                setOrders(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };


        loadOrders();

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
                <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-yellow-400">Dashboard</h1>

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
