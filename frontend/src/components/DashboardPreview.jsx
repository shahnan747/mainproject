import React from 'react';
import { useEffect, useState } from "react";
import api from "../api/api";


export default function DashboardPreview() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  // Dashboard Stats 
  const totalOrders = orders.length;

  const totalRevenue = Array.isArray(orders)
  ?orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  ) : 0;

  const totalAgents = new Set(
    orders.map((order) => order.fieldAgentId?._id)
  ).size;

  // Fake chart values (can later come from backend analytics)
  const chartData = [40, 60, 50, 70, 65, 80, 55];

  if (loading) {
    return (
      <section className="px-6 py-20 bg-gradient-to-br from-[#0a0f1e] to-[#111d3e] text-center">
        <p className="text-white">Loading dashboard...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-20 bg-gradient-to-br from-[#0a0f1e] to-[#111d3e] text-center">
        <p className="text-red-400">{error}</p>
      </section>
    )
  }

  return (
    <section id="about" className="px-6 py-20 text-center bg-gradient-to-br from-[#0a0f1e] to-[#111d3e]">

      {/* Heading */}
      <p className="text-[#f5c842] text-xs font-bold tracking-[1.5px] uppercase mb-3">
        Live Dashboard
      </p>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
        Your command center for <br /> field operations
      </h2>

      <p className="text-white/50 max-w-md mx-auto text-sm">
        A unified view of orders, deliveries, and performance across your network.
      </p>

      {/* Simple Dashboard UI */}
      <div className="max-w-3xl mx-auto mt-12 bg-[#0d1530] rounded-2xl border border-white/10 shadow-lg p-6">

        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-white/40 text-xs">Orders</p>
            <h3 className="text-white font-bold text-lg">{totalOrders}</h3>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-white/40 text-xs">Revenue</p>
            <h3 className="text-white font-bold text-lg">₹{totalRevenue.toLocaleString()}</h3>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-white/40 text-xs">Agents</p>
            <h3 className="text-white font-bold text-lg">{totalAgents}</h3>
          </div>
        </div>

        {/* Chart */}
        <div className="flex items-end gap-2 h-20 mb-6">
          {chartData.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-[#f5c842] rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        {/* Orders List */}
        <div className="text-left">
          <p className="text-white/40 text-xs mb-3">Recent Orders</p>

          {orders.length === 0 ? (
            <p className="text-white/50 text-sm">
              No orders found
            </p>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div key={order._id} className="flex justify-between text-sm text-white/70 py-2 border-b border-white/10" >

                {/* Store Name */}
                <span>{order.storeId?.name || "Unknown Store"}</span>

                {/* Status */}
                <span className={
                  order.status === "Delivered"
                    ? "text-green-400"
                    : order.status === "Assigned"
                      ? "text-blue-400"
                      : order.status === "Loaded"
                        ? "text-purple-400"
                        : "text-yellow-400"
                }
                >
                  {order.status}
                </span>

                {/* Amount */}
                <span>
                  ₹{order.totalAmount?.toLocaleString() || 0}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  )
}

