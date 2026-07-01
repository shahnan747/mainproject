const BASE_URL = "http://localhost:5000/api";

const getToken = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    return user?.token || "";
};

export const fetchStores = async () => {
    try {
        const res = await fetch(`${BASE_URL}/stores`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error("Fetch stores failed:", error);
        return [];
    }
};

export const createStore = async (storeData) => {
    try {
        const res = await fetch(`${BASE_URL}/stores`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(storeData),
        });
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
