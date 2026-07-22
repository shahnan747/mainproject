const detectIntent = (question) => {

    const q = question.toLowerCase();

    // Store analytics
    if (
    q.includes("store") &&
    q.includes("order") &&
    (
        q.includes("top") ||
        q.includes("most") ||
        q.includes("highest") ||
        q.includes("more")
    )
)
    return "TOP_STORE";

    // Collected Orders
    if (
        q.includes("collected") &&
        q.includes("order")
    )
        return "COLLECTED_ORDERS";

    // Delivery analytics
    if (
        q.includes("delivery") &&
        (
            q.includes("performance") ||
            q.includes("report") ||
            q.includes("status")
        )
    )
        return "DELIVERY_PERFORMANCE";

    // Sales analytics
    if (
        q.includes("sales") &&
        (
            q.includes("summary") ||
            q.includes("performance") ||
            q.includes("month")
        )
    )
        return "SALES_SUMMARY";

    // Inventory
    if (
        q.includes("stock")
    )
        return "LOW_STOCK";

    // Revenue
    if (
        q.includes("revenue")
    )
        return "REVENUE";

    // Pending orders
    if (
        q.includes("pending") &&
        q.includes("order")
    )
        return "PENDING_ORDERS";

    return "GENERAL";
};

module.exports = { detectIntent };