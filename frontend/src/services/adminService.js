import api from "../api/api";

export const fetchAdminOrders = async () => {
    try {

        const res = await api.get("/orders");

        return res.data.data || res.data;

    } catch(error) {

        console.error("Failed to fetch admin orders:", error);
        throw error;

    }
};