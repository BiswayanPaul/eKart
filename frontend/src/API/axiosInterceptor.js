import api from "./axiosInstance";
import { refreshToken } from "./auth";

console.log("%cAxios Interceptor Loaded", "color: green; font-size: 16px");

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
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

    // If no response or no status, reject normally
    if (!error.response) {
      console.log("No response from server");
      return Promise.reject(error);
    }

    console.log(
      `Request failed: ${originalRequest.url} - Status: ${error.response.status}`
    );

    // Only handle 401 errors
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Don't refresh for auth routes
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/refresh-token")
    ) {
      console.log("Skipping refresh for auth route:", originalRequest.url);
      return Promise.reject(error);
    }

    // **KEY FIX**: Check if user has active session
    const hasSession = localStorage.getItem("hasSession");
    console.log(
      "Session check - hasSession:",
      hasSession,
      "Type:",
      typeof hasSession
    );

    if (!hasSession || hasSession !== "1") {
      console.log("No active session, skipping token refresh");
      return Promise.reject(error);
    }

    // Prevent infinite retry
    if (originalRequest._retry) {
      console.log("Token refresh already failed, redirecting to login");
      localStorage.removeItem("hasSession");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Queue requests while refreshing
    if (isRefreshing) {
      console.log("Token refresh in progress, queuing request");
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      console.log("Starting token refresh...");
      await refreshToken(); // server sets new token cookies
      console.log("Token refreshed successfully");
      processQueue(null);
      isRefreshing = false;

      console.log("Retrying original request:", originalRequest.url);
      return api(originalRequest); // retry original request
    } catch (err) {
      console.log("Token refresh failed:", err);
      processQueue(err);
      isRefreshing = false;
      localStorage.removeItem("hasSession");
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);

export default api;

// ```

// Run this and check the console. You should see something like:
// ```
// Session check - hasSession: 1 Type: string
// ```

// If you see `null` or something else, that's our problem.

// ---

// ## Most Likely Issue: Login Function Not Being Called Through Context

// Looking at your login page log:
// ```
// Login.jsx:18 Login success: {statusCode: 200, data: {…}, message: 'Login Successful', success: true}
