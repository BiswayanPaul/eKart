import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../API/product.js";
import { addToCart } from "../API/cart.js";
import { useAuth } from "../context/useAuth.js";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMsg, setCartMsg] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data?.data || data);
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);
      await addToCart(product._id, qty);
      setCartMsg("✅ Added to cart");

      setTimeout(() => setCartMsg(""), 2500);
    } catch (err) {
      console.log(err);
      setCartMsg("❌ Failed to add");
      setTimeout(() => setCartMsg(""), 2500);
    } finally {
      setCartLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-10 text-lg font-semibold dark:text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-10 text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex justify-center">
          <img
            src={product.image || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full max-w-md h-96 object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg leading-relaxed">
            {product.description}
          </p>

          <p className="text-3xl font-semibold text-green-600 dark:text-green-400 mt-5">
            ₹{product.price}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Category:{" "}
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {product.category}
            </span>
          </p>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center gap-3">
            <span className="font-medium dark:text-gray-200">Quantity:</span>

            <div className="flex items-center border rounded-lg dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium text-gray-800 dark:text-gray-100">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md disabled:opacity-50 transition"
          >
            {cartLoading ? "Adding..." : "Add to Cart"}
          </button>

          {cartMsg && (
            <p className="mt-2 text-sm font-medium dark:text-white">
              {cartMsg}
            </p>
          )}

          <Link
            to="/"
            className="mt-6 inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Product;
