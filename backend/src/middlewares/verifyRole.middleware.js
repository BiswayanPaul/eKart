import { ApiError } from "../utils/ApiError.js";

export const verifyRole = async (req, res, next) => {
  const role = req.user.role;
  if (role !== "admin") {
    throw new ApiError(403, "Forbidden: Admins only");
  }
  next();
};
