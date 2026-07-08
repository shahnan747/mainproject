import axios from "axios";

import { db } from "../db/db";

const BASE_URL = "http://localhost:5000/api";

export const syncOfflineDrafts = async () => {

    const token = localStorage.getItem("token");

    const drafts = await db.offlineDrafts.toArray();

    for (const draft of drafts) {

        try {

            await axios.post(

                `${BASE_URL}/orders`,

                {

                    storeId: draft.storeId,

                    products: draft.items,

                    totalAmount: draft.totalAmount,

                    orderDate: draft.orderDate,

                    status: "collected"

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            await db.offlineDrafts.delete(draft.id);

        }

        catch (err) {

            console.log("Sync failed", err);

        }

    }

};

export const syncSingleDraft = async (draft) => {

    const token = localStorage.getItem("token");

    await axios.post(
        `${BASE_URL}/orders`,
        {
            storeId: draft.storeId,
            products: draft.items,
            totalAmount: draft.totalAmount,
            orderDate: draft.orderDate,
            status: "collected"
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    await db.offlineDrafts.delete(draft.id);
};
