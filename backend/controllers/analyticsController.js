const Order = require("../models/Order");

const getAnalytics = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("storeId", "name");

    const revenue = orders.reduce(
      (sum, order) =>
        order.status === "delivered"
          ? sum + order.totalAmount
          : sum,
      0
    );

    const pendingPayments = orders.reduce(
      (sum, order) =>
        order.paymentStatus === "pending"
          ? sum + order.totalAmount
          : sum,
      0
    );

    const profit = revenue * 0.2; // Example: 20% profit

    const revenueMap = {};

    orders.forEach((order) => {
      if (order.status !== "delivered") return;

      const date = new Date(order.orderDate).toISOString().split("T")[0];

      revenueMap[date] = (revenueMap[date] || 0) + order.totalAmount;
    });

    const revenueByDate = Object.entries(revenueMap).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    res.status(200).json({
      success: true,
      data: {
        orders,
        revenue,
        profit,
        pendingPayments,
        revenueByDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};