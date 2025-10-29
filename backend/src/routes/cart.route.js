import { Router } from "express";
import {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  getUserCart,
} from "../controllers/cart.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";

const router = Router();

router.use(verifyJwt);

router.post("/add", addItemToCart);
router.delete("/remove/:productId", removeItemFromCart);
router.put("/update/:productId", updateItemQuantity);
router.get("/", getUserCart);

export { router as cartRouter };
