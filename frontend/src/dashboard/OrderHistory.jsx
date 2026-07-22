import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const getStatusStyle = (status) => {
  switch (status) {
    case "Collected":
      return "bg-yellow-400 text-white";
    case "Assigned":
      return "bg-blue-600 text-white";
    case "Delivered":
      return "bg-green-600 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrders = async () => { 
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex justify-center p-3 sm:p-4">
      <div className="w-full max-w-3xl lg:max-w-4xl bg-[#111827] rounded-3xl shadow-2xl border border-white/10 overflow-hidden">

        {/* Header */}
        <div className="bg-[#0f172a] border-b border-white/10 text-white p-4 flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/order")}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            ←
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-yellow-400 tracking-wide">
            Order History
          </h1>
        </div>

        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          <h2 className="text-lg font-semibold text-gray-300">Orders</h2>

          {/* Order List */}
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders found</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-2xl flex flex-col gap-3 sm:gap-4 hover:bg-white/10 transition"
                >
                  {/* Top Row */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <h3 className="font-semibold text-white">
                        {order.storeId?.name}
                      </h3>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Amount + Date */}
                  <p className="text-gray-400 text-xs sm:text-sm text-gray-400">
                    ₹{order.totalAmount} • {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  {/* Products */}
                  <div className="text-xs sm:text-sm text-gray-300 flex flex-wrap gap-2">
                    {order.items?.map((item) => (
                      <span
                        key={item._id}
                        className="bg-white/10 px-2 py-1 rounded-md text-xs"
                      >
                        {item.productId?.name} ({item.quantity})
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-xl hover:opacity-90 transition w-full sm:w-fit text-sm sm:text-base">
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/order")}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2.5 sm:py-3 rounded-2xl font-semibold hover:opacity-90 transition text-sm sm:text-base"
          >
            Create New Order
          </button>
        </div>
      </div>
    </div>
  );

}
