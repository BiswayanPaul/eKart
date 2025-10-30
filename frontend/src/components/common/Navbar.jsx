import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getAllAvailableCategories } from "../../API/product";
import { Menu, X, ShoppingCart, User, ChevronDown } from "lucide-react";
import ThemeButton from "../ui/ThemeBtn";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const [authMode, setAuthMode] = useState("Login");
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    getAllAvailableCategories()
      .then((data) => setCategory(["All", ...data.data]))
      .catch((err) => console.error("Category fetch failed", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchText}&category=${selectedCategory}`);
    setMobileMenu(false);
  };

  return (
    <nav className="shadow-md sticky top-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="container mx-auto flex items-center justify-between gap-4 py-3 px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 rounded-lg border dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-2xl text-blue-600 dark:text-blue-400"
          >
            MyStore
          </Link>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 gap-2 grow max-w-xl"
        >
          <select
            className="bg-transparent text-sm dark:text-gray-200 outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {category.map((cat, idx) => (
              <option key={idx}>{cat}</option>
            ))}
          </select>
          <input
            className="grow bg-transparent outline-none text-gray-700 dark:text-gray-100 text-sm"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
            Search
          </button>
        </form>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme */}
          <ThemeButton />

          {/* Auth */}
          {!isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => navigate(`/${authMode.toLowerCase()}`)}
                className="flex items-center gap-1.5 border dark:border-gray-700 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                {authMode}
                <ChevronDown
                  size={16}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLoginDropdown(!showLoginDropdown);
                  }}
                />
              </button>

              {showLoginDropdown && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-32 p-1">
                  <button
                    className="block w-full px-3 py-2 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    onClick={() => setAuthMode("Login")}
                  >
                    Login
                  </button>
                  <button
                    className="block w-full px-3 py-2 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    onClick={() => setAuthMode("Signup")}
                  >
                    Signup
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/account")}
                className="flex items-center gap-1 border dark:border-gray-700 px-4 py-2 rounded-lg text-sm dark:text-white"
              >
                <User size={18} /> Account
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}

          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="relative bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <ShoppingCart size={18} />
            Cart
          </button>
        </div>
      </div>

      {/* ✅ Mobile Expanded Menu */}
      {mobileMenu && (
        <div className="md:hidden p-4 space-y-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          {/* Search */}
          <form onSubmit={handleSearch} className="space-y-2">
            <select
              className="w-full border dark:border-gray-700 dark:bg-gray-800 p-2 rounded-md dark:text-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {category.map((cat, idx) => (
                <option key={idx}>{cat}</option>
              ))}
            </select>

            <input
              className="w-full border dark:border-gray-700 dark:bg-gray-800 p-2 rounded-md dark:text-white"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-md">
              Search
            </button>
          </form>

          {/* Auth */}
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate(`/${authMode.toLowerCase()}`)}
                className="w-full bg-gray-100 dark:bg-gray-800 py-2 rounded-md dark:text-white"
              >
                {authMode}
              </button>
              <button
                onClick={() =>
                  setAuthMode(authMode === "Login" ? "Signup" : "Login")
                }
                className="w-full bg-gray-200 dark:bg-gray-700 py-2 rounded-md dark:text-white"
              >
                Switch to {authMode === "Login" ? "Signup" : "Login"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/account")}
                className="w-full bg-gray-100 dark:bg-gray-800 py-2 rounded-md dark:text-white"
              >
                Account
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full bg-red-500 text-white py-2 rounded-md"
              >
                Logout
              </button>
            </>
          )}

          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-green-600 text-white py-2 rounded-md flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} /> Cart
          </button>

          {/* Theme toggle */}
          <div className="pt-2 flex justify-center">
            <ThemeButton />
          </div>
        </div>
      )}
    </nav>
  );
}
