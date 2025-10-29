import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cartItem.model.js";
import { Product } from "../models/product.model.js";

const addItemToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity = 1 } = req.body;

  if (!productId) throw new ApiError(400, "Product ID is required");

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  if (product.stock < quantity) {
    throw new ApiError(400, "Insufficient stock for the requested quantity");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      products: [{ product: productId, quantity }],
      slug: `cart-${userId}`,
    });
  } else {
    const itemIndex = cart.products.findIndex((p) => {
      const pid =
        typeof p.product === "object"
          ? p.product._id.toString()
          : p.product.toString();
      return pid === productId;
    });

    if (
      product.stock <
      quantity + (itemIndex > -1 ? cart.products[itemIndex].quantity : 0)
    ) {
      throw new ApiError(400, "Insufficient stock already added in cart");
    }

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
  }

  await cart.populate("products.product", "name price category images slug");

  res
    .status(200)
    .json(new ApiResponse(200, cart, "Item added to cart successfully"));
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity = 1 } = req.body;

  if (!productId) throw new ApiError(400, "Product ID is required");

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found to remove");

  // Find the item safely
  const itemIndex = cart.products.findIndex((p) => {
    const pid =
      p.product && typeof p.product === "object"
        ? p.product._id?.toString()
        : p.product?.toString();
    return pid === productId;
  });

  if (itemIndex === -1) {
    console.log("❌ Product not found in cart:", productId);
    throw new ApiError(404, "Product not found in cart");
  }

  const currentItem = cart.products[itemIndex];
  if (!currentItem || typeof currentItem.quantity !== "number") {
    console.log("⚠️ Invalid cart item structure:", currentItem);
    throw new ApiError(500, "Corrupted cart data");
  }

  // Decrease quantity or remove item
  currentItem.quantity -= quantity;

  if (currentItem.quantity <= 0) {
    // remove that item completely
    cart.products.splice(itemIndex, 1);
  }

  // If cart empty → delete it
  if (cart.products.length === 0) {
    await Cart.deleteOne({ _id: cart._id });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Cart is empty and has been deleted"));
  }

  await cart.save();
  await cart.populate("products.product", "name price category images slug");

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item updated or removed successfully"));
});

const updateItemQuantity = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId || req.body.productId;
  const { quantity } = req.body;

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found to update");
  }

  const itemIndex = cart.products.findIndex((p) => {
    const pid =
      p.product && typeof p.product === "object"
        ? p.product._id?.toString()
        : p.product?.toString();
    return pid === productId;
  });

  if (itemIndex === -1) {
    console.log("❌ Product not found in cart:", productId);
    throw new ApiError(404, "Product not found in cart");
  }

  cart.products[itemIndex].quantity = quantity;
  await cart.save();
  await cart.populate("products.product", "name price category images slug");

  res
    .status(200)
    .json(new ApiResponse(200, cart, "Item quantity updated successfully"));
});

const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate(
    "products.product",
    "name price category images slug"
  );

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "User cart fetched successfully"));
});

export { addItemToCart, removeItemFromCart, updateItemQuantity, getUserCart };
