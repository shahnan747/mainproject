import React from 'react'

export default function DashboardPreview() {
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
            <h3 className="text-white font-bold text-lg">1,200</h3>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-white/40 text-xs">Revenue</p>
            <h3 className="text-white font-bold text-lg">₹3.2L</h3>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-white/40 text-xs">Agents</p>
            <h3 className="text-white font-bold text-lg">48</h3>
          </div>
        </div>

        {/* Fake Chart */}
        <div className="flex items-end gap-2 h-20 mb-6">
          {[40, 60, 50, 70, 65, 80, 55].map((h, i) => (
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

          <div className="flex justify-between text-sm text-white/70 py-2 border-b border-white/10">
            <span>Happy Stores</span>
            <span className="text-green-400">Delivered</span>
            <span>₹12,400</span>
          </div>

          <div className="flex justify-between text-sm text-white/70 py-2 border-b border-white/10">
            <span>Sharma Store</span>
            <span className="text-blue-400">In Transit</span>
            <span>₹8,750</span>
          </div>

          <div className="flex justify-between text-sm text-white/70 py-2">
            <span>Gupta Traders</span>
            <span className="text-yellow-400">Pending</span>
            <span>₹21,200</span>
          </div>
        </div>

      </div>
    </section>
  )
}

