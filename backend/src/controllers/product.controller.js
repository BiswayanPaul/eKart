import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import slugify from "slugify";

const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, images } = req.body;

  if (!name || !price || !category || category.length === 0) {
    throw new ApiError(400, "Name, price, and category are required");
  }

  const slug = slugify(name, { lower: true });

  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
    throw new ApiError(409, "Product with this name already exists");
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    images,
    slug,
  });

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product added successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

//   console.log({ id, updates });
  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

const getProducts = asyncHandler(async (req, res) => {
  const { category, name } = req.query;

  let filter = {};

  if (category) {
    filter.category = { $in: [category] };
  }

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }

  const products = await Product.find(filter);

  res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    throw new ApiError(404, "Product not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedProduct, "Product deleted successfully"));
});


const getAllAvailableCategories = asyncHandler(async(req,res)=>{
    const categories = await Product.distinct("category");
    res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));ß
})

export {
  addProduct,
  updateProduct,
  getProductById,
  getProducts,
  deleteProduct,
  getAllAvailableCategories
};
