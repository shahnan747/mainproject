import Order from "../models/Order.js";

export async function getDeliveryPerformance() {

    const delivered = await Order.countDocuments({
        status: "delivered"
    });

    const loaded = await Order.countDocuments({
        status: "loaded"
    });

    const assigned = await Order.countDocuments({
        status: "assigned"
    });

    return `
Delivered Orders : ${delivered}

Loaded Orders : ${loaded}

Assigned Orders : ${assigned}
`;

}