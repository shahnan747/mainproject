import { useEffect, useState } from "react";
import { fetchGroceries } from "../services/productService";
import { Link } from "react-router-dom";

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchGroceries();
            setProducts(data);
        };
        loadProducts();
    }, []);

    return (
        <section id="product" className="bg-gradient-to-br from-[#0a0f1e] to-[#111d3e] px-6 py-20 text-center">

            {/* Heading */}
            <p className="text-[#f5c842] text-xs font-bold tracking-[1.5px] uppercase mb-3">
                Products
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                Explore Our Products
            </h2>

            <p className="text-white/50 max-w-md mx-auto text-sm mb-12">
                Browse grocery products available for your field sales operations.
            </p>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">

                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left backdrop-blur 
                       hover:-translate-y-1 hover:border-yellow-400/40 transition-all"
                    >

                        {/* Image */}
                        <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />

                        {/* Title */}
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                            {product.title}
                        </h3>

                        {/* Category */}
                        <p className="text-white/40 text-xs mb-2 capitalize">
                            {product.category}
                        </p>

                        {/* Price */}
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-[#f5c842] font-bold">
                                ₹{product.price}
                            </span>

                            <Link to="/login"
                                  className="text-xs bg-yellow-400 text-black px-3 py-1 rounded-md hover:bg-yellow-300"
                            >
                              Add
                            </Link>
                        </div>

                    </div>
                ))}

            </div>
        </section>
    );
}