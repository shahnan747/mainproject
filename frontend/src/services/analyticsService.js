import api from "../api/api";

export const fetchAnalytics = async () => {
    const res = await api.get("/analytics");
    return res.data.data;
};