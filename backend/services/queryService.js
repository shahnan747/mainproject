import { getTopStore } from "./storeQueries.js";
import { getDeliveryPerformance } from "./deliveryQueries.js";
import { getSalesSummary } from "./analyticsQueries.js";
import { getLowStockProducts } from "./productQueries.js";
import { getPendingOrders } from "./orderQueries.js";
import { getCollectedOrders } from "./orderQueries.js";

export async function getData(intent) {

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

}