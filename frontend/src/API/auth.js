import api from "./axiosInstance.js";

const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    console.log("Login Successful:", response);
    return response.data;
  } catch (error) {
    console.log("Login Failed:", error);
    throw error.response?.data || { message: "Login Request Failed" };
  }
};

const register = async (username, password, email, fullname, role) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      password,
      email,
      fullname,
      role,
    });
    return response.data;
  } catch (error) {
    console.log("Registration Failed:", error);
    throw error.response?.data || { message: "Registration Request Failed" };
  }
};

const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.log("Logout Failed:", error);
    throw error.response?.data || { message: "Logout Request Failed" };
  }
};

const getCurrentUser = async () => {
  const response = await api.get("/auth/current-user");
  return response.data;
};

const refreshToken = async () => {
  try {
    const response = await api.post("/auth/refresh-token");
    return response.data;
  } catch (error) {
    console.log("Token Refresh Failed:", error);
    throw error.response?.data || { message: "Token Refresh Request Failed" };
  }
};

export { login, register, logout, getCurrentUser, refreshToken };
