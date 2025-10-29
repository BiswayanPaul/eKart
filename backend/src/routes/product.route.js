import { Router } from "express";
import {
  addProduct,
  updateProduct,
  getProductById,
  getProducts,
  deleteProduct,
} from "../controllers/product.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { verifyRole } from "../middlewares/verifyRole.middleware.js";
const router = Router();

router.post("/add", verifyJwt, verifyRole, addProduct);
router.put("/update/:id", verifyJwt, verifyRole, updateProduct);
router.get("/:id", getProductById);
router.get("/", getProducts);
router.delete("/:id", verifyJwt, verifyRole, deleteProduct);

export { router as productRouter };
