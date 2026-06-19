import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AssignOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [route, setRoute] = useState("Select Route");
  const [deliveryPerson, setDeliveryPerson] = useState("");
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);

    if (order) {
        setSelectedOrders([order.id]); // auto-select clicked order
      }
  }, []);

  const handleSelectOrder = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id)
        ? prev.filter((o) => o !== id)
        : [...prev, id]
    );
  };

  const handleAssign = () => {
    const updatedOrders = orders.map((order) =>
      selectedOrders.includes(order.id)
        ? {
            ...order,
            status: "Assigned",
            route,
            deliveryPerson,
          }
        : order
    );

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setSelectedOrders([]);
    alert("Orders Assigned Successfully");
  };

return (
  <div className="min-h-screen bg-[#0a0f1e] p-3 sm:p-4 flex justify-center">
    <div className="w-full max-w-3xl lg:max-w-4xl bg-[#111827] rounded-3xl shadow-2xl border border-white/10 overflow-hidden">

      {/* Header */}
      <div className="bg-[#0f172a] border-b border-white/10 text-white p-4 sm:p-5">
        <h1 className="text-xl sm:text-2xl font-semibold text-yellow-400 tracking-wide">
          Assign Orders
        </h1>
      </div>

      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">

        {/* Route */}
        <div>
          <h2 className="font-semibold mb-2 text-base sm:text-lg text-gray-300">
            Select Route
          </h2>
          <select
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:ring-2 focus:ring-yellow-500 outline-none"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
          >
            <option value="" className="bg-[#111827]">Select Route</option>
            <option className="bg-[#111827]">Route 1</option>
            <option className="bg-[#111827]">Route 2</option>
            <option className="bg-[#111827]">Route 3</option>
            <option className="bg-[#111827]">Route 4</option>
          </select>
        </div>

        {/* Orders */}
        <div>
          <h2 className="font-semibold mb-2 text-lg text-gray-300">
            Orders
          </h2>

          <div className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl max-h-48 sm:max-h-64 overflow-y-auto space-y-2 sm:space-y-3 backdrop-blur">
            {orders.map((order) => (
              <label
                key={order.id}
                className="flex flex-col items-start gap-2 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="accent-indigo-500"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => handleSelectOrder(order.id)}
                />

                <div className="flex justify-between w-full text-sm sm:text-base">
                  <span className="font-medium text-white">
                    {order.store?.name}
                  </span>

                  <span className="text-gray-400">
                    ₹{order.amount}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Delivery */}
        <div>
          <h2 className="font-semibold mb-2 text-lg text-gray-300">
            Assign To
          </h2>
          <select
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:ring-2 focus:ring-yellow-500 outline-none"
            value={deliveryPerson}
            onChange={(e) => setDeliveryPerson(e.target.value)}
          >
            <option value="" className="bg-[#111827]">
              Select Delivery Person
            </option>
            <option className="bg-[#111827]">Delivery 1</option>
            <option className="bg-[#111827]">Delivery 2</option>
            <option className="bg-[#111827]">Delivery 3</option>
            <option className="bg-[#111827]">Delivery 4</option>
          </select>
        </div>

        {/* Button */}
        <button
          onClick={handleAssign}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black py-2.5 sm:py-3 rounded-xl font-semibold transition"
        >
          Assign Orders
        </button>

      </div>
    </div>
  </div>
);

}