import api from "./axiosInstance.js";

// Create order
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Order Creation Failed:", error);
    throw error.response?.data || { message: "Order creation failed" };
  }
};

// Get logged-in user's orders
export const getUserOrders = async () => {
  try {
    const response = await api.get("/orders/my");
    return response.data;
  } catch (error) {
    console.error("Get Orders Failed:", error);
    throw error.response?.data || { message: "Fetch user orders failed" };
  }
};

// Get order by ID
export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Order Failed:", error);
    throw error.response?.data || { message: "Fetch order failed" };
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Update Order Status Failed:", error);
    throw error.response?.data || { message: "Update status failed" };
  }
};

// Cancel order
export const cancelOrder = async (id) => {
  try {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Cancel Order Failed:", error);
    throw error.response?.data || { message: "Cancel order failed" };
  }
};
