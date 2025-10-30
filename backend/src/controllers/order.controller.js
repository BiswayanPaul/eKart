import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cartItem.model.js";
import { Product } from "../models/product.model.js";

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress } = req.body;

  const cart = await Cart.findOne({ user: userId, status: "Active" }).populate(
    "products.product",
    "name price stock"
  );

  if (!cart || cart.products.length === 0) {
    throw new ApiError(400, "Cart is empty or does not exist");
  }

  const items = cart.products.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    priceAtPurchase: item.product.price,
  }));

  const totalAmount = items.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  // Check stock availability
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.quantity) {
      throw new ApiError(
        400,
        `Product ${product ? product.name : item.product} is out of stock or does not have enough quantity`
      );
    }
  }

  // Decrease stock for each product
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // Create order
  const order = new Order({
    user: userId,
    cart: cart._id,
    items,
    totalAmount,
    shippingAddress,
    status: "Pending",
    paymentStatus: "Pending",
  });

  // Update cart status
  cart.status = "CheckedOut";
  cart.checkoutAt = new Date();
  await cart.save();
  await order.save();

  res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

  if (orders.length === 0) {
    throw new ApiError(404, "No orders found for this user");
  }

  res.status(200).json(new ApiResponse(200, "User orders fetched", orders));
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById({ _id: id });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json(new ApiResponse(200, "Order fetched", order));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  await order.save();
  res.status(200).json(new ApiResponse(true, "Order status updated", order));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status === "Cancelled") {
    throw new ApiError(400, "Order is already cancelled");
  }

  if (order.status !== "Pending") {
    throw new ApiError(400, "Only pending orders can be cancelled");
  }

  order.status = "Cancelled";
  await order.save();
  res
    .status(200)
    .json(new ApiResponse(true, "Order cancelled successfully", order));
});

export {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
