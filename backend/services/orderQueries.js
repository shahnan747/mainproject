import Order from "../models/Order.js";

export async function getPendingOrders() {

    const count = await Order.countDocuments({
        status: "pending"
    });

    return `
Pending Orders: ${count}
`;
}

export async function getCollectedOrders() {

    const orders = await Order.find({
        status: "collected"
    }).populate("storeId", "name");

    if (!orders.length) {
        return "There are currently no collected orders.";
    }

    return orders.map(order => `
Order ID: ${order._id}
Store: ${order.storeId?.name}
Total Amount: ₹${order.totalAmount}
Status: ${order.status}
`).join("\n");

}