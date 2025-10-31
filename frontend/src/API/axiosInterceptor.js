import api from "./axiosInstance";
import { refreshToken } from "./auth";

console.log("%cAxios Interceptor Loaded", "color: green; font-size: 16px");

let isRefreshing = false;
let failedQueue = [];

// Handle queued requests while refresh is happening
const processQueue = (error, token = null) => {
  console.log("Processing queue:", failedQueue.length, "requests");
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // ⛑️ If request failed with Unauthorized & wasn't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // ✅ IMPORTANT FIX: Only attempt refresh if cookie exists
      // ❌ Do not block refresh based on cookie visibility
      // If login or register request, do not try refresh
      if (
        originalRequest.url.includes("/login") ||
        originalRequest.url.includes("/signup")
      ) {
        return Promise.reject(error);
      }

      // ✅ If already refreshing, queue the requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      // Mark request for retry
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshToken(); // get new tokens

        processQueue(null);
        isRefreshing = false;

        return api(originalRequest); // retry original request
      } catch (err) {
        processQueue(err);
        isRefreshing = false;
        window.location.href = "/login"; // logout user
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
