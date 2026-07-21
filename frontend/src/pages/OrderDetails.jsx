import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-4 flex justify-center">
      <div className="w-full max-w-3xl bg-[#111827] rounded-3xl border border-white/10 p-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-white"
          >
            ←
          </button>

          <h1 className="text-2xl font-bold text-yellow-400">
            Order Details
          </h1>
        </div>

        {/* Store */}
        <div className="mb-6">
          <h2 className="text-lg text-white font-semibold">
            {order.storeId?.name}
          </h2>

          <p className="text-gray-400 text-sm">
            {order.storeId?.location}
          </p>
        </div>

        {/* Status */}
        <div className="mb-6">
          <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
            {order.status}
          </span>
        </div>

        {/* Products */}
        <div className="space-y-3 mb-6">
          <h3 className="text-white font-semibold text-lg">
            Products
          </h3>

          {order.items?.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-medium">
                  {item.productId?.name}
                </p>

                <p className="text-gray-400 text-sm">
                  ₹{item.productId?.price} / {item.productId?.unit}
                </p>
              </div>

              <div className="text-yellow-400 font-bold">
                × {item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex justify-between text-lg">
            <span className="text-gray-300">Total Amount</span>

            <span className="text-yellow-400 font-bold">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}