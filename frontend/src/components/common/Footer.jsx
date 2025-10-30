import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-700 mt-10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto py-10 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            MyStore
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Best place to find quality products at the best price.
          </p>

          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            <button className="hover:scale-110 transition">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22,12a10,10,0,1,0-11.5,9.87V15.46H7.89V12h2.61V9.8c0-2.58,1.54-4,3.9-4a15.87,15.87,0,0,1,2.31.2V8.5H15.6c-1.28,0-1.67.79-1.67,1.6V12h2.84l-.45,3.46H13.93v6.41A10,10,0,0,0,22,12Z" />
              </svg>
            </button>

            <button className="hover:scale-110 transition">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.56c-.89.39-1.84.65-2.84.77A4.92 4.92 0 0023.34 3a9.86 9.86 0 01-3.13 1.2A4.92 4.92 0 0016.62 2a4.92 4.92 0 00-4.9 4.91c0 .39.04.77.13 1.14A13.95 13.95 0 011.64 3.16 4.92 4.92 0 003.2 9a4.9 4.9 0 01-2.23-.62v.06a4.92 4.92 0 003.95 4.81 4.96 4.96 0 01-2.22.08 4.94 4.94 0 004.6 3.42A9.87 9.87 0 010 20.11 13.9 13.9 0 007.55 22c9.05 0 14-7.5 14-14V7A10.04 10.04 0 0024 4.56Z" />
              </svg>
            </button>

            <button className="hover:scale-110 transition">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12,2.16C6.49,2.16,2.16,6.49,2.16,12S6.49,21.84,12,21.84,21.84,17.51,21.84,12,17.51,2.16,12,2.16ZM16.66,16.66H14.91V13.52c0-.75-.02-1.71-1.04-1.71s-1.2.82-1.2,1.66v3.19H10.92V9.77H12.6v.94h.03a1.82,1.82,0,0,1,1.64-.9c1.75,0,2.39,1.15,2.39,2.65ZM8.53,8.83a1.1,1.1,0,1,1,1.1-1.1A1.1,1.1,0,0,1,8.53,8.83Zm.85,7.83H7.69V9.77H9.38Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                My Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Support
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/support"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                to="/shipping"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                Shipping Info
              </Link>
            </li>
            <li>
              <Link
                to="/returns"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                Returns
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Subscribe
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            Subscribe to get updates and deals.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter email"
              className="p-2 w-full border dark:border-gray-700 rounded-l-md dark:bg-gray-800"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
              Go
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center py-4 border-t dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} MyStore — All rights reserved.
      </div>
    </footer>
  );
}
