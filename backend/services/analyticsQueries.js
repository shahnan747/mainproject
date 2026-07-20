import Order from "../models/Order.js";

export async function getSalesSummary() {

    const orders = await Order.find({
        status: "delivered"
    });

    const revenue = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
    );

    return `
Revenue : ₹${revenue}

Delivered Orders : ${orders.length}
`;

}