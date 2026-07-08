const BASE_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

export const generateAISuggestion = async (storeId) => {
    try {

        const res = await fetch(`${BASE_URL}/ai/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ storeId }),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("AI suggestion failed:", error);
        return null;
    }
};

export const fetchAIHistory = async (storeId) => {
    try {
        const res = await fetch(`${BASE_URL}/ai/history/${storeId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error("AI history fetch failed:", error);
        return [];
    }
};

export const fetchPaymentDelays = async () => {
    try {
        const res = await fetch(`${BASE_URL}/ai/analytics/payment-delays`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Payment delay fetch failed:", error);
        return null;
    }
};
