import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/productService";

const emptyForm = {
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [toast, setToast] = useState("");

    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
      
        setLoading(true);

        const data = await fetchProducts();
       console.log("RAW RESPONSE:", data);

        setProducts(data || []);

        setLoading(false);
    };

    const showToast = (msg) => {
        setToast(msg);

        setTimeout(() => {
            setToast("");
        }, 3000);
    };

    const openAdd = () => {
        setEditTarget(null);
        setForm(emptyForm);
        setFormError("");
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setEditTarget(product);

        setForm({
            name: product.name || "",
            category: product.category || "",
            price: product.price || "",
            stock: product.stock || "",
            description: product.description || "",
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
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        if (!form.name || !form.price) {
            setFormError("Product name and price are required.");
            return;
        }

        setSaving(true);

        let result;

        if (editTarget) {
            result = await updateProduct(editTarget._id, form);
        } else {
            result = await createProduct(form);
        }

        setSaving(false);

        if (result?.success) {
            closeModal();
            await loadProducts();

            showToast(
                editTarget
                    ? "Product updated!"
                    : "Product added!"
            );
        } else {
            setFormError(
                result?.message ||
                "Something went wrong."
            );
        }
    };

    const handleDelete = async (id) => {
        const result = await deleteProduct(id);

        setDeleteConfirm(null);

        if (result?.success) {
            await loadProducts();

            showToast("Product deleted.");
        }
    };

    const filtered = products.filter(
        (p) =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.toLowerCase().includes(search.toLowerCase())
    );

    const totalProducts = products.length;

    const lowStock = products.filter(
        (p) => p.stock > 0 && p.stock <= 5
    ).length;

    const outOfStock = products.filter(
        (p) => p.stock <= 0
    ).length;

    const getStockBadge = (stock) => {
        if (stock <= 0) {
            return "bg-red-500/10 text-red-400 border-red-500/20";
        }

        if (stock <= 5) {
            return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
        }

        return "bg-green-500/10 text-green-400 border-green-500/20";
    };

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
                        <h1 className="text-2xl font-bold">
                            Product <span className="text-[#f5c842]">Management</span>
                        </h1>

                        <p className="text-white/50 text-sm mt-1">
                            Manage inventory and products
                        </p>
                    </div>

                    <button
                        onClick={openAdd}
                        className="bg-[#f5c842] text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition"
                    >
                        + Add Product
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <p className="text-white/40 text-sm">
                            Total Products
                        </p>

                        <h2 className="text-2xl font-bold mt-2">
                            {totalProducts}
                        </h2>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">
                        <p className="text-yellow-300/70 text-sm">
                            Low Stock
                        </p>

                        <h2 className="text-2xl font-bold text-yellow-400 mt-2">
                            {lowStock}
                        </h2>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                        <p className="text-red-300/70 text-sm">
                            Out of Stock
                        </p>

                        <h2 className="text-2xl font-bold text-red-400 mt-2">
                            {outOfStock}
                        </h2>
                    </div>

                </div>

                {/* Search */}
                <div className="mb-5">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-80 bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#f5c842] transition"
                    />
                </div>

                {/* Loading */}
                {loading && (
                    <div className="space-y-3 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white/5 border border-white/10 rounded-2xl p-5"
                            >
                                <div className="h-4 bg-white/10 rounded w-40 mb-3" />
                                <div className="h-3 bg-white/10 rounded w-24" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Product List */}
                {!loading && filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                        {filtered.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition"
                            >

                                <div className="flex items-start justify-between gap-3">

                                    <div>
                                        <h3 className="font-semibold text-white">
                                            📦 {product.name}
                                        </h3>

                                        <p className="text-white/40 text-sm mt-1">
                                            {product.category || "Uncategorized"}
                                        </p>
                                    </div>

                                    <span
                                        className={`text-xs border px-2 py-1 rounded-full ${getStockBadge(product.stock)}`}
                                    >
                                        {product.stock <= 0
                                            ? "Out"
                                            : `${product.stock} in stock`}
                                    </span>

                                </div>

                                <div className="mt-5 flex items-center justify-between">

                                    <div>
                                        <p className="text-white/40 text-xs">
                                            Price
                                        </p>

                                        <h2 className="text-xl font-bold text-[#f5c842]">
                                            ₹{product.price}
                                        </h2>
                                    </div>

                                    <div className="flex gap-2">

                                        <button
                                            onClick={() => openEdit(product)}
                                            className="px-4 py-2 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition"
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            onClick={() => setDeleteConfirm(product)}
                                            className="px-4 py-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition"
                                        >
                                            🗑️ Delete
                                        </button>

                                    </div>

                                </div>

                                {product.description && (
                                    <p className="text-white/40 text-sm mt-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                )}

                            </div>
                        ))}

                    </div>
                )}

                {/* Empty State */}
                {!loading && filtered.length === 0 && (
                    <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-16 text-center">

                        <div className="text-5xl mb-4">
                            📦
                        </div>

                        <p className="text-white/40 text-sm">
                            {search
                                ? "No products match your search."
                                : "No products yet. Add your first product."}
                        </p>

                    </div>
                )}

                {/* Add/Edit Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">

                        <div className="bg-[#0a0f1e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">

                            <div className="flex items-center justify-between mb-5">

                                <h2 className="text-base font-semibold text-white">
                                    {editTarget
                                        ? "Edit Product"
                                        : "Add New Product"}
                                </h2>

                                <button
                                    onClick={closeModal}
                                    className="text-white/40 hover:text-white text-xl"
                                >
                                    ×
                                </button>

                            </div>

                            <div className="space-y-3">

                                {[
                                    {
                                        label: "Product Name *",
                                        name: "name",
                                        placeholder: "e.g. Rice Bag",
                                    },
                                    {
                                        label: "Category",
                                        name: "category",
                                        placeholder: "e.g. Grocery",
                                    },
                                    {
                                        label: "Price *",
                                        name: "price",
                                        placeholder: "e.g. 450",
                                    },
                                    {
                                        label: "Stock",
                                        name: "stock",
                                        placeholder: "e.g. 25",
                                    },
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

                                <div>
                                    <label className="block text-xs text-white/50 mb-1">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Write product details..."
                                        rows="4"
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#f5c842] transition resize-none"
                                    />
                                </div>

                            </div>

                            {formError && (
                                <p className="text-red-400 text-xs mt-3">
                                    {formError}
                                </p>
                            )}

                            <div className="flex gap-3 mt-5">

                                <button
                                    onClick={closeModal}
                                    className="flex-1 py-2.5 rounded-xl text-sm bg-white/10 hover:bg-white/20 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 py-2.5 rounded-xl text-sm bg-[#f5c842] text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-40"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editTarget
                                            ? "Update Product"
                                            : "Add Product"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}

                {/* Delete Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">

                        <div className="bg-[#0a0f1e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">

                            <div className="text-center mb-5">

                                <div className="text-4xl mb-3">
                                    ⚠️
                                </div>

                                <h2 className="text-base font-semibold text-white mb-1">
                                    Delete Product?
                                </h2>

                                <p className="text-white/40 text-sm">
                                    Are you sure you want to delete{" "}
                                    <span className="text-[#f5c842]">
                                        {deleteConfirm.name}
                                    </span>
                                    ?
                                </p>

                            </div>

                            <div className="flex gap-3">

                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-2.5 rounded-xl text-sm bg-white/10 hover:bg-white/20 transition"
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

