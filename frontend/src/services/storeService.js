import { db } from "../db/db";
const BASE_URL = "http://localhost:5000/api";

const getToken = () => {
    return localStorage.getItem("token") || "";
};


export const fetchStores = async () => {

    console.log("Navigator online:", navigator.onLine);

    if (!navigator.onLine) {
        console.log("Loading stores from IndexedDB directly");
        return await db.stores.toArray();
    }

    try {
        const res = await fetch(`${BASE_URL}/stores/`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch stores");
        }
        const data = await res.json();
        const stores = data.data || [];

        console.log("Stores from API:", stores);

        // Save stores to IndexedDB
        await db.stores.clear();

        if (stores.length > 0) {
            await db.stores.bulkAdd(stores);
        }

        console.log("Stores saved offline:", stores.length);

        return stores;
    } catch (error) {
        console.error("Fetch stores failed:", error);

        // Load stores from IndexedDB when offline
        const offlineStores = await db.stores.toArray();

        return offlineStores;
    }
};

export const createStore = async (storeData) => {
    try {
        const res = await fetch(`${BASE_URL}/stores/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(storeData),

        });
        console.log(localStorage.getItem("token"));
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Create store failed:", error);
        return null;
    }
};

export const updateStore = async (id, storeData) => {
    try {
        const res = await fetch(`${BASE_URL}/stores/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(storeData),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Update store failed:", error);
        return null;
    }
};

export const deleteStore = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/stores/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Delete store failed:", error);
        return null;
    }
};
