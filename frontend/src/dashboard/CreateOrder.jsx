import { useState, useEffect } from "react";
import { fetchProducts } from "../services/productService";
import { fetchStores } from "../services/storeService";
import { useNavigate, useLocation } from "react-router-dom";
import { storeValidate, amountValidate } from "../utils/Validations";
import { saveOfflineDraft } from "../services/offlineDraftService";
import api from "../api/api";

export default function CreateOrder() {
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [storeSearch, setStoreSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});

    const [visibleCount] = useState(3);
    const [loading, setLoading] = useState(true);

    const [suggestedOrders, setSuggestedOrders] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const [showSelector, setShowSelector] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const storeId = location.state?.storeId ||
        localStorage.getItem("selectedStore");

    const selectedDate = location.state?.selectedDate;

    const aiData = location.state;
    const aiStoreId = location.state?.storeId;
    const aiSuggestedItems = location.state?.suggestedItems || [];

    const user = JSON.parse(localStorage.getItem("currentUser"));
    console.log("Logged user:", user);

    const [form, setForm] = useState({
        storeName: "",
        fieldAgentId: user?._id,
        amount: "",
        location: selectedStore?.location,
        status: "Pending",
        orderDate: selectedDate || ""
    });

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);

            try{
            const data = await fetchProducts();
             console.log("Products returned to CreateOrder:", data);
            setProducts(data || []);
            } finally {
            setLoading(false);
            }
        };

        loadProducts();
    }, []);

    useEffect(() => {
        if (aiStoreId && stores.length > 0) {

            const matchedStore = stores.find(
                (store) => store._id === aiStoreId
            );

            if (matchedStore) {
                setSelectedStore(matchedStore);
                setStoreSearch(matchedStore.name);

                localStorage.setItem(
                    "selectedStore",
                    matchedStore._id
                );
            }
        }

        if (aiSuggestedItems.length > 0) {

            const aiQuantities = {};

            aiSuggestedItems.forEach((item) => {
                if (item.productId) {
                    aiQuantities[item.productId] =
                        item.suggestedQuantity;
                }
            });

            setQuantities(aiQuantities);
            setShowSelector(true);
        }

    }, [aiStoreId, stores]);

    const fetchSuggestions = async () => {
        try {


            setLoadingSuggestions(true);

            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/ai/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ storeId: selectedStore?._id, }),
            });

            const data = await res.json();

            setSuggestedOrders(data?.data?.suggestedItems || []);

            const suggestionQuantities = {};

            data?.data?.suggestedItems?.forEach((item) => {
                if (item.productId) {
                    suggestionQuantities[item.productId] =
                        item.suggestedQuantity;
                }
            });

            setQuantities((prev) => ({
                ...prev,
                ...suggestionQuantities,
            }));

        } catch (err) {
            console.error("Failed to fetch suggestions:", err);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    useEffect(() => {
        if (aiData?.suggestedItems?.length > 0) {

            // Convert AI suggestions into quantities object
            const aiQuantities = {};

            aiData.suggestedItems.forEach((item) => {
                if (item.productId) {
                    aiQuantities[item.productId] =
                        item.suggestedQuantity;
                }
            });

            // Auto-fill quantities
            setQuantities(aiQuantities);

            // Automatically open product selector
            setShowSelector(true);
        }
    }, [aiData]);

    useEffect(() => {
        if (storeId) fetchSuggestions();
    }, [storeId]);

    useEffect(() => {

    const loadStores = async () => {

        const data = await fetchStores();

        console.log("Stores returned to CreateOrder:", data);

        setStores(data || []);

    };

    loadStores();

}, []);


    const filteredStores = stores.filter((store) =>
        store.name
            .toLowerCase()
            .includes(storeSearch.toLowerCase())
    );


    const handleQuantityChange = (id, delta) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + delta),
        }));
    };

    const totalAmount = products.reduce((total, product) => {
        return total + (quantities[product._id] || 0) * product.price;
    }, 0);

    const saveOrder = async (statusType) => {
        try {
            if (!storeValidate(selectedStore)) return;
            if (!amountValidate(totalAmount)) return;

            if (!selectedStore?._id) {
                alert("Please select a store first");
                return;
            }

            const token = localStorage.getItem("token");

            const items = products
                .filter((p) => quantities[p._id] > 0)
                .map((p) => ({
                    productId: p._id,
                    quantity: quantities[p._id],
                    price: p.price,
                }));

            const orderData = {
                storeId: selectedStore?._id,
                 storeName: selectedStore?.name,

                fieldAgentId: user?._id,
                agentName: user?.name,

                items: products
                    .filter(p => quantities[p._id] > 0)
                    .map(p => ({
                        productId: p._id,
                        productName: p.name,
                        quantity: quantities[p._id],
                        price: p.price,
                    })),
                    
                totalAmount,
                status: statusType.toLowerCase(),
                orderDate: form.orderDate,
            };
            //  Only for offline drafts

            if (statusType.toLowerCase() === "draft" && !navigator.onLine) {
                await saveOfflineDraft(orderData);

                alert("Draft saved offline. It will sync automatically when you're online.");

                navigate("/agentdashboard");
                return;
            }


            await api.post("/orders", orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            navigate("/agentdashboard");
        } catch (err) {
            console.error("Failed to save order:", err);
        }
    };


    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white flex justify-center p-3 sm:p-6">
            <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur rounded-3xl border border-white/10 shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-white/5 border-b border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <button
                        onClick={() => navigate("/agentdashboard")}
                        className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm transition w-full sm:w-auto"
                    >
                        Back
                    </button>
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

                        <button
                            onClick={() => navigate("/add-stores")}
                            className="mt-3 text-sm text-yellow-300 hover:underline"
                        >
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
                                onClick={() => setShowSelector(!showSelector)}
                                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm transition w-full sm:w-auto"
                            >
                                Select Product
                            </button>
                        </div>

                        {showSelector && (loading ? (
                            <p className="text-white/40">Loading...</p>
                        ) : (
                            <div className="space-y-3">
                                {products.slice(0, visibleCount).map((product) => (
                                    <div
                                        key={product._id}
                                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white/5 hover:bg-white/10 p-3 sm:p-4 rounded-xl border border-white/10 transition"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div>
                                                <p>{product.name}</p>
                                                <p className="text-sm text-white/60">₹{product.price}</p>
                                            </div>
                                        </div>


                                        <div className="flex items-center gap-2 justify-end sm:justify-normal">
                                            <button
                                                className="px-3 sm:px-3 py-1 bg-white/10 rounded-lg"
                                                onClick={() => handleQuantityChange(product._id, -1)}
                                            >
                                                -
                                            </button>

                                            <span className="px-3 sm:px-3 font-semibold text-sm sm:text-base">
                                                {quantities[product._id] || 0}
                                            </span>

                                            <button
                                                className="px-3 py-1 bg-white/10 rounded-lg"
                                                onClick={() => handleQuantityChange(product._id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}



                        {/* Suggested Order */}
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 my-4">
                            <h3 className="font-semibold mb-3 text-lg text-yellow-400">
                                💡 Suggested Order
                            </h3>

                            {loadingSuggestions ? (
                                <p className="text-white/60 text-sm">Generating AI suggestions...</p>
                            ) : suggestedOrders.length === 0 ? (
                                <p className="text-white/50 text-sm">
                                    No suggestions available yet.
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2 text-sm mb-4">
                                    {suggestedOrders.map((item, index) => (
                                        <div key={index} className="bg-white/10 px-3 py-1 rounded-lg">
                                            <div>
                                                <p className="text-white">{item.productName}: </p>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="px-3 py-1 bg-white/10 rounded-lg"
                                                        onClick={() =>
                                                            handleQuantityChange(item.productId, -1)
                                                        }
                                                    >
                                                        -
                                                    </button>

                                                    <span className="font-semibold text-yellow-400 min-w-[24px] text-center">
                                                        {quantities[item.productId] || 0}
                                                    </span>

                                                    <button
                                                        className="px-3 py-1 bg-white/10 rounded-lg"
                                                        onClick={() =>
                                                            handleQuantityChange(item.productId, 1)
                                                        }
                                                    >
                                                        +
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={fetchSuggestions}
                                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black py-3 rounded-xl font-semibold transition"
                            >
                                Refresh Suggestions
                            </button>
                        </div>

                        {/* Date */}
                        <div>
                            <h2 className="font-semibold mb-2 text-lg text-white/80">
                                Select Delivery Date
                            </h2>

                            <input
                                type="date"
                                value={form.orderDate}
                                onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
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
                                onClick={() => saveOrder("draft")}
                                className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl transition"
                            >
                                Save Draft
                            </button>

                            <button
                                onClick={() => saveOrder("collected")}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-2 rounded-xl font-semibold transition"
                            >
                                Submit Order
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )

}
