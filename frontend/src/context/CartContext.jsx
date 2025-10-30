import { useState, useEffect } from "react";
import {
  getCart,
  addToCart,
  removeItem,
  clearCart,
} from "../API/cart";
import { useAuth } from "./useAuth";
import { CartContext } from "./useCart";

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart whenever user logs in
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      if (res.success) {
        setCartItems(res.data.items || []);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const res = await addToCart(productId, quantity);
      if (res.success) {
        setCartItems(res.data.items);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const res = await removeItem(productId);
      if (res.success) {
        setCartItems(res.data.items);
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await clearCart();
      if (res.success) {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartCount,
        loading,
        fetchCart,
        handleAddToCart,
        handleRemoveFromCart,
        handleClearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
