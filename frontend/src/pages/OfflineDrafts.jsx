import { useEffect, useState } from "react";
import { getOfflineDrafts } from "../services/offlineDraftService";
import { useNavigate } from "react-router-dom";
import { syncOfflineDrafts, syncSingleDraft } from "../services/syncService";

const OfflineDrafts = () => {

    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const loadDrafts = async () => {

            try {

                const data = await getOfflineDrafts();

                setDrafts(data);

            } catch (error) {

                console.error("Failed to load offline drafts:", error);

            } finally {

                setLoading(false);
            }
        };

        loadDrafts();

    }, []);

    const handleSubmit = async (draft) => {

        if (!navigator.onLine) {
            alert("You are offline. Please connect to the internet.");
            return;
        }

        try {
            await syncSingleDraft(draft);

            const updatedDrafts = await getOfflineDrafts();
            setDrafts(updatedDrafts);

            alert("Order submitted successfully.");
        } catch (error) {
            console.error(error);
            alert("Failed to submit order.");
            
    throw error;
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center">
                <p className="text-white/60">
                    Loading offline drafts...
                </p>
            </div>
        );
    }


    return (

        <div className="min-h-screen bg-[#0a0f1e] text-white p-4 sm:p-6">

            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="bg-white/5 backdrop-blur rounded-3xl border border-white/10 shadow-xl p-5 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">

                    <button
                        onClick={() => navigate("/agentdashboard")}
                        className="w-full sm:w-auto bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
                    >
                        Back
                    </button>


                    <h1 className="text-2xl font-semibold text-yellow-400">
                        Offline Draft Orders
                    </h1>


                    <div className="w-full sm:w-auto bg-yellow-400/10 text-yellow-300 px-4 py-2 rounded-xl text-sm text-center">
                        {drafts.length} Drafts
                    </div>

                </div>



                {drafts.length === 0 ? (

                    <div className="bg-white/5 backdrop-blur rounded-3xl border border-white/10 p-8 text-center">

                        <p className="text-white/50">
                            No offline drafts available.
                        </p>

                    </div>


                ) : (

                    <div className="space-y-4">

                        {drafts.map((draft) => (

                            <div
                                key={draft.id}
                                className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 shadow-xl p-5 hover:bg-white/10 transition"
                            >


                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">

                                    <h2 className="text-lg font-semibold text-yellow-400">
                                        Draft Order #{draft.id}
                                    </h2>


                                    <button
                                        onClick={() => handleSubmit(draft)}
                                        className="bg-yellow-400/10 text-yellow-300 hover:bg-white/20 px-3 py-1 rounded-lg text-sm"
                                    >
                                        Pending Sync
                                    </button>

                                </div>



                                <div className="space-y-2 text-sm text-white/70">


                                    <p>
                                        <span className="text-white font-medium">
                                            Store:
                                        </span>{" "}
                                        {draft.storeName}
                                    </p>


                                    <p>
                                        <span className="text-white font-medium">
                                            Agent:
                                        </span>{" "}
                                        {draft.agentName || "Not available"}
                                    </p>


                                    <p>
                                        <span className="text-white font-medium">
                                            Products:
                                        </span>{" "}
                                        {draft.items?.length || 0}
                                    </p>


                                    <p>
                                        <span className="text-white font-medium">
                                            Total:
                                        </span>{" "}
                                        <span className="text-yellow-400 font-semibold">
                                            ₹{draft.totalAmount}
                                        </span>
                                    </p>


                                    <p>
                                        <span className="text-white font-medium">
                                            Order Date:
                                        </span>{" "}
                                        {draft.orderDate || "Not selected"}
                                    </p>


                                    <p className="text-xs text-white/40 pt-2">
                                        Created:{" "}
                                        {new Date(draft.createdAt).toLocaleString()}
                                    </p>


                                </div>


                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

};


export default OfflineDrafts;