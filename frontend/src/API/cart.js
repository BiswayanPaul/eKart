import api from "./axiosInstance.js";

// Add item to cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post("/cart/add", { productId, quantity });
    return response.data;
  } catch (error) {
    console.error("Add to Cart Failed:", error);
    throw error.response?.data || { message: "Add to cart request failed" };
  }
};

// Remove item from cart
export const removeItem = async (productId) => {
  try {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Remove from Cart Failed:", error);
    throw (
      error.response?.data || { message: "Remove from cart request failed" }
    );
  }
};

// Update item quantity
export const updateItem = async (productId, quantity) => {
  try {
    const response = await api.put(`/cart/update/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error("Update Cart Quantity Failed:", error);
    throw error.response?.data || { message: "Update quantity failed" };
  }
};

// Get logged-in user's cart
export const getCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    console.error("Fetch Cart Failed:", error);
    throw error.response?.data || { message: "Fetch cart request failed" };
  }
};

// Clear cart (optional utility for frontend)
export const clearCart = async () => {
  try {
    const res = await api.get("/cart");
    const items = res.data?.data?.items || [];
    for (const item of items) {
      await removeItem(item.productId);
    }
    return { success: true, message: "Cart cleared" };
  } catch (err) {
    console.error("Clear Cart Failed:", err);
    throw { message: "Clear cart request failed" };
  }
};
