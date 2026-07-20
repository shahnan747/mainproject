import Product from "../models/Product.js";

export async function getLowStockProducts() {

    const products = await Product.find({
        stock: {
            $lt: 10
        }
    });

    return JSON.stringify(products);

}