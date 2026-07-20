import api from "../api/api";
const BASE_URL = "http://localhost:5000/api";


export const fetchOrders = async () => {
  const res = await api.get("/orders");
  return res.data.data || res.data;
};

export const assignOrder = async (orderIds, deliveryPersonnelId) => {
  const res = await api.put(`/orders/assign`, {
    orderIds,
    deliveryPersonnelId,
  });

  return res.data;
};

export const fetchDeliveryPersonnel = async () => {
  try {
    const res = await api.get("/auth/delivery-personnel");

    return res.data.data || [];

  } catch (error) {
    console.error(
      "Failed to fetch delivery personnel:",
      error
    );

    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.put(`/orders/${orderId}/status`, {
    status,
  });

  return res.data;
};