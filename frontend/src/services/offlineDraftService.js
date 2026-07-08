import { db } from "../db/db";

export const saveOfflineDraft = async (order) => {

    console.log("Inside saveOfflineDraft:", order);

    const id = await db.offlineDrafts.add({
        ...order,
        status: "pending",
        createdAt: new Date().toISOString()
    });

    console.log("Inserted draft id:", id);

      const allDrafts = await db.offlineDrafts.toArray();

   console.log(
    "All drafts count:",
    allDrafts.length,
    JSON.stringify(allDrafts, null, 2)
);
};

  

export const getOfflineDrafts = async () => {

    return await db.offlineDrafts.toArray();

};

export const deleteOfflineDraft = async (id) => {

    await db.offlineDrafts.delete(id);

};