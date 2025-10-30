import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { verifyRole } from "../middlewares/verifyRole.middleware.js";

const router = express.Router();

router.post("/", verifyJwt, createOrder);
router.get("/my", verifyJwt, getUserOrders);
router.get("/:id", verifyJwt, getOrderById);
router.patch("/:id/status", verifyJwt, verifyRole, updateOrderStatus);
router.patch("/:id/cancel", verifyJwt, cancelOrder);

export { router as orderRouter };
