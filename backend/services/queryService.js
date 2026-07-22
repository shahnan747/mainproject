const { getTopStore } = require("./storeQueries");
const { getDeliveryPerformance } = require("./deliveryQueries");
const { getSalesSummary } = require("./analyticsQueries");
const { getLowStockProducts } = require("./productQueries");
const {
    getPendingOrders,
    getCollectedOrders
} = require("./orderQueries");

const getData = async (intent) => {

    switch (intent) {

        case "TOP_STORE":
            return await getTopStore();

        case "DELIVERY_PERFORMANCE":
            return await getDeliveryPerformance();

        case "SALES_SUMMARY":
            return await getSalesSummary();

        case "LOW_STOCK":
            return await getLowStockProducts();

        case "PENDING_ORDERS":
            return await getPendingOrders();

        case "COLLECTED_ORDERS":
            return await getCollectedOrders();

        default:
            return null;

    }

};

module.exports = getData;

