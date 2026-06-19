import React from 'react'

export default function Media() {
  return (
    <section className="bg-gradient-to-br from-[#0a0f1e] to-[#111d3e] px-6 py-20 text-center">
      
      {/* Heading */}
      <p className="text-[#f5c842] text-xs font-bold uppercase mb-3">
        In Action
      </p>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-10">
        See FieldHub at work
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

        {/* Card 1 (Large feel) */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#1a2f5e] to-[#0d1c3d] rounded-2xl p-8 border border-white/10 text-center">
          <div className="w-14 h-14 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            📊
          </div>
          <h3 className="text-white font-bold mb-2">
            Live Dashboard
          </h3>
          <p className="text-white/50 text-sm mb-4">
            Track orders, payments, and performance in real-time.
          </p>

          <div className="flex justify-center gap-2 flex-wrap">
            <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Live</span>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">Analytics</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-br from-[#0d3b38] to-[#092825] rounded-2xl p-6 border border-white/10 text-center">
          <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            👥
          </div>
          <h3 className="text-white font-semibold mb-1">
            Agent Management
          </h3>
          <p className="text-white/50 text-xs">
            Manage and track field agents easily.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-br from-[#2d1a5e] to-[#1c0f3d] rounded-2xl p-6 border border-white/10 text-center">
          <div className="w-12 h-12 bg-purple-400/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            📈
          </div>
          <h3 className="text-white font-semibold mb-1">
            Profit Reports
          </h3>
          <p className="text-white/50 text-xs">
            Analyze sales and profit trends.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-gradient-to-br from-[#3d2a00] to-[#2a1c00] rounded-2xl p-6 border border-white/10 text-center">
          <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            📱
          </div>
          <h3 className="text-white font-semibold mb-1">
            Mobile Orders
          </h3>
          <p className="text-white/50 text-xs">
            Place orders from anywhere, even offline.
          </p>
        </div>

      </div>
    </section>

  );
}
