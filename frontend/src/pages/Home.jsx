import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../API/product";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data?.data || []);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-10 text-lg font-semibold dark:text-gray-200">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-10 text-red-500 dark:text-red-400 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Our Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
            shadow-md hover:shadow-xl dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]
            rounded-xl p-4 transition-transform hover:-translate-y-1 cursor-pointer"
          >
            <img
              src={product.image || "https://via.placeholder.com/200"}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />

            <h2 className="font-semibold text-lg mt-3 text-gray-900 dark:text-white line-clamp-1">
              {product.name}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm">
              {product.description}
            </p>

            <p className="mt-2 text-xl font-bold text-green-600 dark:text-green-400">
              ₹{product.price}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
