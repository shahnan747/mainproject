import { db } from "../db/db";

// Fake Store API
export const fetchGroceries = async () => {
    try {
        const res = await fetch("https://dummyjson.com/products/category/groceries");
        const data = await res.json();
        return data.products;
    }
    catch (error) {
        console.error("API failed, using fallback");
        return null;
    }
};


const BASE_URL = `${import.meta.env.VITE_API_URL}/products`;

const getToken = () => {
    return localStorage.getItem("token") || "";
};

/* =========================
   FETCH PRODUCTS
========================= */
export const fetchProducts = async () => {

    console.log("Navigator online:", navigator.onLine);

if (!navigator.onLine) {
    console.log("Loading products from IndexedDB directly");
    return await db.products.toArray();
}

    try {
        const res = await fetch(BASE_URL, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        const products = data.data || [];

        // Save products to IndexedDB for offline use
        if (products.length > 0) {

            await db.products.clear();

            await db.products.bulkAdd(products);

            console.log("Products saved to IndexedDB:", products.length);

        }


        return products;

    } catch (error) {
        console.error("Fetch products failed:", error);

        // Load products from IndexedDB when offline
        const offlineProducts = await db.products.toArray();

        return offlineProducts;
    }
};

/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = async (productData) => {
    try {
        const res = await fetch(BASE_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },

            body: JSON.stringify(productData),
        });

        const data = await res.json();

        return data;

    } catch (error) {
        console.error("Create product failed:", error);

        return {
            success: false,
            message: "Failed to create product",
        };
    }
};

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = async (id, productData) => {
    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },

            body: JSON.stringify(productData),
        });

        const data = await res.json();

        return data;

    } catch (error) {
        console.error("Update product failed:", error);

        return {
            success: false,
            message: "Failed to update product",
        };
    }
};

/* =========================
   DELETE PRODUCT
========================= */
export const deleteProduct = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        const data = await res.json();

        return data;

    } catch (error) {
        console.error("Delete product failed:", error);

        return {
            success: false,
            message: "Failed to delete product",
        };
    }
};

