import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJwt, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/current-user", verifyJwt, getCurrentUser);

export { router as authRouter };
