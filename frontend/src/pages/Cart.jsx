import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeItem, updateItem } from "../API/cart";
import { createOrder } from "../API/order";
import { useAuth } from "../context/useAuth";

function Cart() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      console.log("Cart Data:", res);

      const activeCart = res?.data[res.data.length - 1];
      //   console.log("Active Cart:", activeCart);
      setCartItems(activeCart?.products || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    fetchCart();
  }, [isAuthenticated, navigate]);

  const handleQtyChange = async (productId, qty) => {
    if (qty < 1) return;

    await updateItem(productId, qty);
    fetchCart();
  };

  const handleRemove = async (productId, qty) => {
    await removeItem(productId, qty);
    fetchCart();
  };

  const handleCheckout = async () => {
    setBtnLoading(true);

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await createOrder(orderData);
      setMsg("✅ Order placed successfully!");
      setCartItems([]);

      setTimeout(() => {
        navigate("/orders");
      }, 1200);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to place order");
    } finally {
      setBtnLoading(false);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item?.product?.price || 0) * item.quantity,
    0
  );

  if (loading)
    return (
      <div className="flex justify-center py-10 text-lg dark:text-white">
        Loading cart...
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Your Cart is Empty 🛒
        </h2>
        <Link
          to="/"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your Cart
        </h2>

        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 py-4 border-b dark:border-gray-700"
          >
            <img
              src={item.product.image || "https://via.placeholder.com/80"}
              className="w-20 h-20 rounded-md object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">
                {item.product.name}
              </p>
              <p className="text-gray-500 dark:text-gray-300">
                ₹{item.product.price}
              </p>

              {/* Qty */}
              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    handleQtyChange(item.productId, item.quantity - 1)
                  }
                  className="px-2 py-1 border rounded-l dark:border-gray-600 dark:text-white"
                >
                  -
                </button>
                <span className="px-4 py-1 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQtyChange(item.productId, item.quantity + 1)
                  }
                  className="px-2 py-1 border rounded-r dark:border-gray-600 dark:text-white"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => handleRemove(item.productId, item.quantity)}
              className="text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Total */}
        <div className="mt-6 flex justify-between text-lg font-semibold dark:text-white">
          <span>Total:</span>
          <span>₹{totalPrice}</span>
        </div>

        {msg && (
          <p className="mt-2 text-sm font-medium dark:text-white">{msg}</p>
        )}

        <button
          onClick={handleCheckout}
          disabled={btnLoading}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {btnLoading ? "Placing Order..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}

export default Cart;
