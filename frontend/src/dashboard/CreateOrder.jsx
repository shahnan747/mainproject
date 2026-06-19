import { useState, useEffect } from "react";
import { dummyStores } from "../data/dummyData";
import { fetchGroceries } from "../services/productService";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { storeValidate, amountValidate } from "../utils/Validations";

export default function CreateOrder() {
    const [selectedStore, setSelectedStore] = useState("");
    const [storeSearch, setStoreSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [visibleCount, setVisibleCount] = useState(3);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const selectedDate = location.state?.selectedDate;

    const [form, setForm] = useState({
        storeName: "",
        amount: "",
        location: selectedStore.location,
        status: "Pending",
        date: selectedDate || ""
    });

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchGroceries();
            setProducts(data);
            setLoading(false);
        };
        loadProducts();
    }, []);

    const filteredStores = dummyStores.filter((store) =>
        store.name.toLowerCase().includes(storeSearch.toLowerCase())
    );

    const handleQuantityChange = (id, delta) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + delta),
        }));
    };

    const totalAmount = products.reduce((total, product) => {
        return total + (quantities[product.id] || 0) * product.price;
    }, 0);

    const saveOrder = (statusType) => {

        if (!storeValidate(selectedStore)) return;
        if (!amountValidate(totalAmount)) return;

        const newOrder = {
            id: Date.now(),
            store: selectedStore,
            products: products.filter(p => quantities[p.id] > 0),
            quantities,
            amount: totalAmount,
            date: form.date,
            status: statusType,
        };

        const existingOrders =
            JSON.parse(localStorage.getItem("orders")) || [];

        localStorage.setItem(
            "orders",
            JSON.stringify([newOrder, ...existingOrders])
        );

        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white flex justify-center p-3 sm:p-6">
            <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur rounded-3xl border border-white/10 shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-white/5 border-b border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h1 className="text-2xl font-semibold text-yellow-400">
                        Create Order
                    </h1>
                    <button
                        onClick={() => navigate("/history")}
                        className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm transition w-full sm:w-auto"
                    >
                        History
                    </button>
                </div>

                <div className="p-6 space-y-8">

                    {/* Store Selection */}
                    <div>
                        <h2 className="font-semibold mb-2 text-lg text-white/80">
                            Select Store
                        </h2>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search or select a store..."
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                value={storeSearch}
                                onChange={(e) => {
                                    setStoreSearch(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                            />

                            {showDropdown && (
                                <div className="absolute w-full bg-[#0a0f1e] border border-white/10 mt-1 rounded-xl shadow-lg max-h-40 overflow-y-auto z-20">
                                    {filteredStores.map((store, index) => (
                                        <div
                                            key={index}
                                            className="p-3 hover:bg-white/10 cursor-pointer transition"
                                            onClick={() => {
                                                setSelectedStore(store);
                                                setStoreSearch(store.name);
                                                setShowDropdown(false);
                                            }}
                                        >
                                            {store.name} - {store.location}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="mt-3 text-sm text-yellow-300 hover:underline">
                            + Add New Store
                        </button>
                    </div>

                    {/* Products */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                            <h2 className="font-semibold text-lg text-white/80">
                                Products
                            </h2>
                            <button
                                onClick={() => setVisibleCount(prev => prev + 3)}
                                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm transition w-full sm:w-auto"
                            >
                                + Add Product
                            </button>
                        </div>

                        {loading ? (
                            <p className="text-white/40">Loading...</p>
                        ) : (
                            <div className="space-y-3">
                                {products.slice(0, visibleCount).map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white/5 hover:bg-white/10 p-3 sm:p-4 rounded-xl border border-white/10 transition"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <img
                                                src={product.thumbnail}
                                                alt={product.title}
                                                className="w-10 h-10  sm:w-12 sm:h-12 rounded-lg object-cover bg-white"
                                            />

                                            <div>
                                                <p className="font-medium text-sm sm:text-base">{product.title}</p>
                                                <p className="text-xs sm:text-sm text-white/60">
                                                    ₹{product.price}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 justify-end sm:justify-normal">
                                            <button
                                                className="px-3 sm:px-3 py-1 bg-white/10 rounded-lg"
                                                onClick={() => handleQuantityChange(product.id, -1)}
                                            >
                                                -
                                            </button>

                                            <span className="px-3 sm:px-3 font-semibold text-sm sm:text-base">
                                                {quantities[product.id] || 0}
                                            </span>

                                            <button
                                                className="px-3 py-1 bg-white/10 rounded-lg"
                                                onClick={() => handleQuantityChange(product.id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Suggested Order */}
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                        <h3 className="font-semibold mb-2 text-lg text-yellow-400">
                            💡 Suggested Order
                        </h3>

                        <p className="text-sm mb-4 text-white/60 flex flex-wrap gap-2">
                            Milk: <span className="text-yellow-400 font-semibold">12</span> &nbsp;
                            Bread: <span className="text-yellow-400 font-semibold">6</span> &nbsp;
                            Eggs: <span className="text-yellow-400 font-semibold">18</span>
                        </p>

                        <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black py-3 rounded-xl font-semibold transition">
                            Apply Suggestions
                        </button>
                    </div>

                    {/* Date */}
                    <div>
                        <h2 className="font-semibold mb-2 text-lg text-white/80">
                            Select Delivery Date
                        </h2>

                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                        />
                    </div>

                    {/* Total */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-t border-white/10 pt-4">
                        <h2 className="font-semibold text-lg">
                            Total: <span className="text-yellow-400">₹{totalAmount}</span>
                        </h2>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => saveOrder("Draft")}
                            className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl transition"
                        >
                            Save Draft
                        </button>

                        <button
                            onClick={() => saveOrder("Collected")}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-2 rounded-xl font-semibold transition"
                        >
                            Submit Order
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
