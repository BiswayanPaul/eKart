import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: [
      {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
    ],
    images: [
      {
        url: { type: String, trim: true },
        altText: { type: String, trim: true },
      },
    ],

    slug: { type: String, trim: true, lowercase: true, unique: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
