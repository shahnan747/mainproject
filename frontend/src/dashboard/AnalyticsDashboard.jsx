import { useState, useEffect } from "react";
import { fetchAnalytics } from "../services/analyticsService";
import ChartsSection from "../data/ChartSection";

export default function AnalyticsDashboard() {

  const [analytics, setAnalytics] = useState({
    orders: [],
    revenue: 0,
    profit: 0,
    pendingPayments: 0,
    revenueByDate: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <p className="text-yellow-400">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-3 sm:p-4 flex justify-center">

      <div className="w-full max-w-4xl bg-[#111827] rounded-3xl shadow-2xl border border-white/10 overflow-hidden">

        {/* Header */}
        <div className="bg-[#0f172a] border-b border-white/10 text-white p-5">
          <h1 className="text-xl sm:text-2xl font-semibold text-yellow-400 tracking-wide">
            Analytics
          </h1>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

            {/* Revenue */}
            <div className="bg-white/5 backdrop-blur border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition">
              <p className="font-semibold text-sm text-green-400">💰 Revenue</p>
              <h2 className="text-2xl font-bold mt-2 text-white">
                ₹{analytics.revenue.toFixed(2)}
              </h2>
            </div>

            {/* Profit */}
            <div className="bg-white/5 backdrop-blur border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition">
              <p className="font-semibold text-sm text-indigo-400">📈 Profit</p>
              <h2 className="text-2xl font-bold mt-2 text-white">
                ₹{analytics.profit.toFixed(2)}
              </h2>
            </div>

            {/* Pending */}
            <div className="bg-white/5 backdrop-blur border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition">
              <p className="font-semibold text-sm text-yellow-400">⚠ Pending Payments</p>
              <h2 className="text-2xl font-bold mt-2 text-white">
                ₹{analytics.pendingPayments.toFixed(2)}
              </h2>
            </div>

          </div>

          {/* Chart Section */}
          <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">
              📊 Sales Overview
            </h2>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 overflow-x-auto">
              <ChartsSection revenueByDate={analytics.revenueByDate} />
            </div>
          </div>

          {/* Payment Insights */}
          <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl">
            <h2 className="space-y-2 text-sm sm:text-base text-gray-400">
              ⚠ Payment Insights
            </h2>

            <div className="space-y-2 text-orange-400">
              {analytics.orders
                .filter(order => order.paymentStatus === "pending")
                .map(order => (
                  <p key={order._id}>
                    {order.storeId?.name} → ₹{order.totalAmount}
                  </p>
                ))
              }
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}