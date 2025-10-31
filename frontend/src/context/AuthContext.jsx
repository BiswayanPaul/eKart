import { useState, useEffect } from "react";
import {
  getCurrentUser,
  logout as logoutApi,
  login as loginApi,
} from "../API/auth";
import { AuthContext } from "./useAuth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // **ONLY fetch if session flag exists**
      const hasSession = localStorage.getItem("hasSession");
      if (hasSession !== "1") {
        setLoading(false);
        return;
      }

      try {
        const res = await getCurrentUser();
        console.log("Current user response:", { res });
        if (res.success) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem("hasSession");
        }
      } catch (err) {
        console.log("Error fetching current user:", err);
        setUser(null);
        localStorage.removeItem("hasSession");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    if (res.success) {
      setUser(res.data.user);
      localStorage.setItem("hasSession", "1"); // **Set here on login**
    }
    return res;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      localStorage.removeItem("hasSession");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
