import React, { useEffect, useState } from "react";
import { getUserOrders } from "../API/order";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Orders() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await getUserOrders();
      console.log("Fetched Orders:", res);
      setOrders(res?.message || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    fetchOrders();
  }, [isAuthenticated, navigate]);

  if (loading)
    return (
      <div className="flex justify-center py-10 text-lg dark:text-white">
        Loading orders...
      </div>
    );

  if (!orders.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          No Orders Yet 📦
        </h2>
        <Link
          to="/"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Start Shopping
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Orders
        </h2>

        {orders.map((order) => (
          <div key={order._id} className="border-b py-4 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold dark:text-white">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Status:{" "}
                  <span className="font-medium text-green-600">
                    {order.status}
                  </span>
                </p>
              </div>

              <Link
                to={`/orders/${order._id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Details
              </Link>
            </div>

            <div className="mt-3">
              {order.items.slice(0, 2).map((item) => (
                <p
                  key={item._id}
                  className="text-gray-800 dark:text-gray-200 text-sm"
                >
                  {item?.product?.name} (x{item.quantity})
                </p>
              ))}

              {order.items.length > 2 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  + {order.items.length - 2} more items
                </p>
              )}
            </div>

            <div className="mt-3 text-sm dark:text-gray-200">
              <p>
                <span className="font-semibold">Total:</span> ₹
                {order.totalAmount}
              </p>
              <p className="truncate">
                <span className="font-semibold">Shipping:</span>{" "}
                {order.shippingAddress}
              </p>
            </div>
          </div>
        ))}

        {msg && <p className="mt-3 text-red-500">{msg}</p>}
      </div>
    </div>
  );
}

export default Orders;
