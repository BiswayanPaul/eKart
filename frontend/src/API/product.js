import api from "./axiosInstance.js";

// Get all products (supports filters)
export const getAllProducts = async (query = "") => {
  try {
    const response = await api.get(`/products${query ? `?${query}` : ""}`);
    return response.data;
  } catch (error) {
    console.error("Get Products Failed:", error);
    throw error.response?.data || { message: "Get products failed" };
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Product Failed:", error);
    throw error.response?.data || { message: "Get product failed" };
  }
};

// Add new product (Admin only)
export const addProduct = async (productData) => {
  try {
    const response = await api.post("/products/add", productData);
    return response.data;
  } catch (error) {
    console.error("Add Product Failed:", error);
    throw error.response?.data || { message: "Add product failed" };
  }
};

// Update product (Admin only)
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/update/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Update Product Failed:", error);
    throw error.response?.data || { message: "Update product failed" };
  }
};

// Delete product (Admin only)
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Product Failed:", error);
    throw error.response?.data || { message: "Delete product failed" };
  }
};
