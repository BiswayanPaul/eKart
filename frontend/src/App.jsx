import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/ui/Layout";
import { useState } from "react";
import { useEffect } from "react";
import { ThemeProvider } from "./context/Theme";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Orders from "./pages/Order";
function App() {
  const [themeMode, setThemeMode] = useState("light");

  const lightTheme = () => setThemeMode("light");
  const darkTheme = () => setThemeMode("dark");

  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(themeMode);
  }, [themeMode]);
  return (
    <BrowserRouter>
      <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Protected routes with Layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                {/* add /cart /account etc here */}
              </Route>

              {/* Public routes without Layout */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
