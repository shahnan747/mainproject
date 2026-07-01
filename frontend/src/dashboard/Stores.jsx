import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
} from "../services/storeService";

const emptyForm = {
    name: "",
    location: "",
    contact: "",
    route: "",
    ownerName: "",
};

export default function Stores() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState("");

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        setLoading(true);
        const data = await fetchStores();
        setStores(data);
        setLoading(false);
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    const openAdd = () => {
        setEditTarget(null);
        setForm(emptyForm);
        setFormError("");
        setModalOpen(true);
    };

    const openEdit = (store) => {
        setEditTarget(store);
        setForm({
            name: store.name || "",
            location: store.location || "",
            contact: store.contact || "",
            route: store.route || "",
            ownerName: store.ownerName || "",
        });
        setFormError("");
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditTarget(null);
        setForm(emptyForm);
        setFormError("");
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!form.name || !form.location || !form.contact || !form.route) {
            setFormError("Name, Location, Contact and Route are required.");
            return;
        }
        setSaving(true);
        let result;
        if (editTarget) {
            result = await updateStore(editTarget._id, form);
        } else {
            result = await createStore(form);
        }
        setSaving(false);

        if (result?.success) {
            closeModal();
            await loadStores();
            showToast(editTarget ? "Store updated!" : "Store added!");
        } else {
            setFormError(result?.message || "Something went wrong. Try again.");
        }
    };

    const handleDelete = async (id) => {
        const result = await deleteStore(id);
        setDeleteConfirm(null);
        if (result?.success) {
            await loadStores();
            showToast("Store deleted.");
        }
    };

    const filtered = stores.filter(
        (s) =>
            s.name?.toLowerCase().includes(search.toLowerCase()) ||
            s.route?.toLowerCase().includes(search.toLowerCase()) ||
            s.location?.toLowerCase().includes(search.toLowerCase())
    );

    const routeColors = {
        "Route A": "bg-blue-500/10 text-blue-400 border-blue-500/20",
        "Route B": "bg-purple-500/10 text-purple-400 border-purple-500/20",
        "Route C": "bg-green-500/10 text-green-400 border-green-500/20",
        "Route D": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    };

    const getRouteColor = (route) =>
        routeColors[route] || "bg-white/10 text-white/60 border-white/10";

    return (
        <Layout>
            <div className="p-6 text-white min-h-screen">

                {/* Toast */}
                {toast && (
                    <div className="fixed top-5 right-5 z-50 bg-[#f5c842] text-black text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg animate-bounce">
                        {toast}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Store <span className="text-[#f5c842]">Management</span>
                        </h1>
                        <p className="text-white/50 text-sm mt-1">
                            {stores.length} store{stores.length !== 1 ? "s" : ""} registered
                        </p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-[#f5c842] text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition"
                    >
                        + Add Store
                    </button>
                </div>

                {/* Search */}
                <div className="mb-5">
                    <input
                        type="text"
                        placeholder="Search by name, route or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-80 bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#f5c842] transition"
                    />
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div className="space-y-3 animate-pulse">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between">
                                <div className="space-y-2">
                                    <div className="h-4 bg-white/10 rounded w-36" />
                                    <div className="h-3 bg-white/10 rounded w-24" />
                                </div>
                                <div className="h-8 bg-white/10 rounded w-20" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Stores List */}
                {!loading && filtered.length > 0 && (
                    <div className="space-y-3">
                        {filtered.map((store) => (
                            <div
                                key={store._id}
                                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#f5c842]/10 flex items-center justify-center text-lg shrink-0">
                                        🏪
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-sm font-semibold text-white">
                                                {store.name}
                                            </h3>
                                            <span
                                                className={`text-xs border px-2 py-0.5 rounded-full ${getRouteColor(store.route)}`}
                                            >
                                                {store.route}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                            <p className="text-white/40 text-xs">
                                                📍 {store.location}
                                            </p>
                                            <p className="text-white/40 text-xs">
                                                📞 {store.contact}
                                            </p>
                                            {store.ownerName && (
                                                <p className="text-white/40 text-xs">
                                                    👤 {store.ownerName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 sm:shrink-0">
                                    <button
                                        onClick={() => openEdit(store)}
                                        className="px-4 py-2 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(store)}
                                        className="px-4 py-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && filtered.length === 0 && (
                    <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-16 text-center">
                        <div className="text-5xl mb-4">🏪</div>
                        <p className="text-white/40 text-sm">
                            {search
                                ? "No stores match your search."
                                : "No stores yet. Click + Add Store to get started."}
                        </p>
                    </div>
                )}

                {/* Add / Edit Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#0a0f1e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-semibold text-white">
                                    {editTarget ? "Edit Store" : "Add New Store"}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-white/40 hover:text-white text-xl leading-none transition"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { label: "Store Name *", name: "name", placeholder: "e.g. Sri Stores" },
                                    { label: "Location *", name: "location", placeholder: "e.g. Kollam" },
                                    { label: "Contact *", name: "contact", placeholder: "e.g. 9876543210" },
                                    { label: "Route *", name: "route", placeholder: "e.g. Route A" },
                                    { label: "Owner Name", name: "ownerName", placeholder: "e.g. Ravi Kumar" },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-xs text-white/50 mb-1">
                                            {field.label}
                                        </label>
                                        <input
                                            type="text"
                                            name={field.name}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#f5c842] transition"
                                        />
                                    </div>
                                ))}
                            </div>

                            {formError && (
                                <p className="text-red-400 text-xs mt-3">{formError}</p>
                            )}

                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 py-2.5 rounded-xl text-sm bg-white/10 hover:bg-white/20 text-white transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 py-2.5 rounded-xl text-sm bg-[#f5c842] text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-40"
                                >
                                    {saving ? "Saving..." : editTarget ? "Update Store" : "Add Store"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#0a0f1e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                            <div className="text-center mb-5">
                                <div className="text-4xl mb-3">⚠️</div>
                                <h2 className="text-base font-semibold text-white mb-1">
                                    Delete Store?
                                </h2>
                                <p className="text-white/40 text-sm">
                                    Are you sure you want to delete{" "}
                                    <span className="text-[#f5c842]">{deleteConfirm.name}</span>?
                                    This cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-2.5 rounded-xl text-sm bg-white/10 hover:bg-white/20 text-white transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm._id)}
                                    className="flex-1 py-2.5 rounded-xl text-sm bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
}
