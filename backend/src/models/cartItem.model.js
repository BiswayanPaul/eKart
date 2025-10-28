import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Active", "CheckedOut", "Abandoned"],
      default: "Active",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

cartItemSchema.virtual("totalPrice").get(function () {
  if (!this.products || this.products.length === 0) return 0;

  return this.products.reduce((sum, p) => {
    const price = p.product?.price || 0;
    return sum + price * p.quantity;
  });
});

cartItemSchema.pre(/^find/, function (next) {
  this.populate({
    path: "products.product",
    select: "name price category images slug",
  });
  next();
});

export const Cart = mongoose.model("Cart", cartItemSchema);
