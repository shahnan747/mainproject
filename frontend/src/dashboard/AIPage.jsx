import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { generateAISuggestion, fetchAIHistory } from "../services/aiService";
import { fetchStores } from "../services/storeService";

export default function AIPage() {
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState("");
    const [suggestion, setSuggestion] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("suggest");

    useEffect(() => {
        const loadStores = async () => {
            const data = await fetchStores();
            setStores(data);
        };
        loadStores();
    }, []);

    const handleGenerate = async () => {
        if (!selectedStore) {
            setError("Please select a store first.");
            return;
        }
        setError("");
        setLoading(true);
        setSuggestion(null);
        const result = await generateAISuggestion(selectedStore);
        setLoading(false);
        if (result?.success) {
            setSuggestion(result.data);
        } else {
            setError(result?.message || "Failed to generate suggestion. Try again.");
        }
    };

    const handleViewHistory = async () => {
        if (!selectedStore) {
            setError("Please select a store first.");
            return;
        }
        setError("");
        setHistoryLoading(true);
        setActiveTab("history");
        const data = await fetchAIHistory(selectedStore);
        setHistory(data);
        setHistoryLoading(false);
    };

    const selectedStoreName = stores.find((s) => s._id === selectedStore)?.name || "";

    return (
        <Layout>
            <div className="p-6 text-white min-h-screen">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">
                        AI Order <span className="text-[#f5c842]">Suggestions</span>
                    </h1>
                    <p className="text-white/50 text-sm mt-1">
                        Select a store to get smart order quantity suggestions based on past orders.
                    </p>
                </div>

                {/* Store Selector Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                    <label className="block text-sm text-white/60 mb-2">Select Store</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={selectedStore}
                            onChange={(e) => {
                                setSelectedStore(e.target.value);
                                setSuggestion(null);
                                setHistory([]);
                                setError("");
                            }}
                            className="flex-1 bg-[#0a0f1e] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#f5c842] transition"
                        >
                            <option value="">-- Choose a store --</option>
                            {stores.map((store) => (
                                <option key={store._id} value={store._id}>
                                    {store.name} — {store.route}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !selectedStore}
                            className="flex items-center gap-2 bg-[#f5c842] text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin">⟳</span> Generating...
                                </>
                            ) : (
                                <>✨ Suggest Order</>
                            )}
                        </button>

                        <button
                            onClick={handleViewHistory}
                            disabled={!selectedStore}
                            className="flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm hover:bg-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            🕒 History
                        </button>
                    </div>

                    {error && (
                        <p className="mt-3 text-red-400 text-sm">{error}</p>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setActiveTab("suggest")}
                        className={`px-4 py-1.5 rounded-lg text-sm transition ${activeTab === "suggest"
                            ? "bg-[#f5c842] text-black font-semibold"
                            : "text-white/50 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        Suggestion
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-4 py-1.5 rounded-lg text-sm transition ${activeTab === "history"
                            ? "bg-[#f5c842] text-black font-semibold"
                            : "text-white/50 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        AI History
                    </button>
                </div>

                {/* Suggestion Tab */}
                {activeTab === "suggest" && (
                    <>
                        {/* Loading skeleton */}
                        {loading && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
                                <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between py-3 border-b border-white/5">
                                        <div className="h-3 bg-white/10 rounded w-1/3" />
                                        <div className="h-3 bg-white/10 rounded w-16" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Suggestion Result */}
                        {!loading && suggestion && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h2 className="text-base font-semibold text-white">
                                            Suggested Order for{" "}
                                            <span className="text-[#f5c842]">{selectedStoreName}</span>
                                        </h2>
                                        <p className="text-white/40 text-xs mt-0.5">
                                            Based on {suggestion.basedOnOrders} past order{suggestion.basedOnOrders !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                    <span className="text-xs bg-[#f5c842]/10 text-[#f5c842] border border-[#f5c842]/20 px-3 py-1 rounded-full">
                                        AI Generated
                                    </span>
                                </div>

                                {suggestion.suggestedItems?.length > 0 ? (
                                    <div className="space-y-2">
                                        {/* Table header */}
                                        <div className="flex justify-between text-xs text-white/40 px-3 pb-1 border-b border-white/10">
                                            <span>Product</span>
                                            <span>Suggested Qty</span>
                                        </div>

                                        {suggestion.suggestedItems.map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition rounded-xl px-4 py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#f5c842]/10 flex items-center justify-center text-sm">
                                                        📦
                                                    </div>
                                                    <span className="text-sm text-white">
                                                        {item.productName}
                                                    </span>
                                                </div>
                                                <span className="text-[#f5c842] font-semibold text-sm">
                                                    {item.suggestedQuantity} units
                                                </span>
                                            </div>
                                        ))}

                                        {/* Use Suggestion Button */}
                                        <div className="pt-3">
                                            <button
                                                onClick={() =>
                                                    window.location.assign(
                                                        `/order?storeId=${selectedStore}&ai=true`
                                                    )
                                                }
                                                className="w-full bg-[#f5c842] text-black font-semibold py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition"
                                            >
                                                Use This Suggestion →
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-white/40 text-sm text-center py-6">
                                        No items suggested. Store may have no past orders.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && !suggestion && (
                            <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-12 text-center">
                                <div className="text-5xl mb-4">🤖</div>
                                <p className="text-white/40 text-sm">
                                    Select a store and click <span className="text-[#f5c842]">✨ Suggest Order</span> to get AI-powered quantity recommendations.
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                    <>
                        {historyLoading && (
                            <div className="space-y-3 animate-pulse">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                        <div className="h-3 bg-white/10 rounded w-1/4 mb-3" />
                                        <div className="h-3 bg-white/10 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {!historyLoading && history.length > 0 && (
                            <div className="space-y-3">
                                {history.map((item, i) => (
                                    <div
                                        key={i}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-5"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-white/40">
                                                {new Date(item.createdAt).toLocaleString()}
                                            </span>
                                            <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                                                {item.type?.replace("_", " ")}
                                            </span>
                                        </div>

                                        {item.suggestedItems?.length > 0 ? (
                                            <div className="space-y-1.5">
                                                {item.suggestedItems.map((s, j) => (
                                                    <div
                                                        key={j}
                                                        className="flex justify-between text-sm"
                                                    >
                                                        <span className="text-white/70">{s.productName}</span>
                                                        <span className="text-[#f5c842]">{s.suggestedQuantity} units</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-white/30 text-xs">No items in this record.</p>
                                        )}

                                        <p className="text-white/30 text-xs mt-3">
                                            Requested by: {item.requestedBy?.name || "Unknown"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!historyLoading && history.length === 0 && (
                            <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-12 text-center">
                                <div className="text-5xl mb-4">🕒</div>
                                <p className="text-white/40 text-sm">
                                    No AI history found for this store yet.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
