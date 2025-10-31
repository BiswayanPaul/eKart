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

  // 1️⃣ Ensure a single Active cart exists for the user
  const cart = await Cart.findOneAndUpdate(
    { user: userId, status: "Active" },
    {
      $setOnInsert: {
        user: userId,
        products: [],
        slug: `cart-${userId}`,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // 2️⃣ Ensure cart is Active before adding items
  if (cart.status !== "Active") {
    throw new ApiError(400, "Cannot add items to a non-active cart");
  }

  // 3️⃣ Try to increment quantity if product already in cart
  const incResult = await Cart.updateOne(
    { _id: cart._id, "products.product": productId },
    { $inc: { "products.$.quantity": quantity } }
  );

  // 4️⃣ If product wasn't present, push it
  if (incResult.matchedCount === 0) {
    await Cart.updateOne(
      { _id: cart._id },
      { $push: { products: { product: productId, quantity } } }
    );
  }

  // 5️⃣ Return updated cart
  const updatedCart = await Cart.findById(cart._id).populate(
    "products.product",
    "name price category images slug"
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedCart, "Item added to cart successfully"));
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity = 1 } = req.body;

  console.log(userId, productId, quantity);

  console.log("Request to remove:", productId, "Quantity:", quantity);

  if (!productId) throw new ApiError(400, "Product ID is required");

  const cart = await Cart.findOne({
    user: userId.toString(),
    status: "Active",
  });
  if (!cart) throw new ApiError(404, "Cart not found to remove");

  // Find the item safely
  console.log("Current Cart Products:", cart.products);
  const itemIndex = cart.products.findIndex((p) => {
    console.log("Checking cart item:", p);
    const pid = p.product.id?.toString();

    console.log("Comparing:", pid, "with", productId);
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
  const quantity = req.body.quantity || req.body.data?.quantity;

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  console.log("Updating Cart Item:", productId, "Quantity:", quantity, userId);

  const cart = await Cart.findOne({ user: userId, status: "Active" });
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

  const cart = await Cart.find({ user: userId }).populate(
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
