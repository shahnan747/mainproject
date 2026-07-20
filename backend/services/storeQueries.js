import Order from "../models/Order.js";
import Store from "../models/Store.js";

export async function getTopStore() {

    const result = await Order.aggregate([

        { $unwind: "$items" },

        {
            $group: {

                _id: "$storeId",

                totalProducts: {

                    $sum: "$items.quantity"

                }

            }

        },

        {

            $sort: {

                totalProducts: -1

            }

        },

        {

            $limit: 1

        }

    ]);

    if (!result.length)
        return "No store data available.";

    const store = await Store.findById(result[0]._id);

    return `
Store Name: ${store.name}
Products Ordered: ${result[0].totalProducts}
`;

}