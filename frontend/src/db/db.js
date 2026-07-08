import Dexie from "dexie";

export const db = new Dexie("FieldHubDB");

db.version(2).stores({

    stores: "_id, name",

    products: "_id, name",

    offlineDrafts: "++id, storeId, fieldAgentId, createdAt"
});

