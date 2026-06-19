export const fetchGroceries = async () => {
    try {
        const res = await fetch("https://dummyjson.com/products/category/groceries");
        const data = await res.json();
        return data.products;
    }
    catch (error) {
        console.error("API failed, using fallback");
        return null;
    }
}; 