// TODO:
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJwt = async (req, res, next) => {
  // console.log("Verifying JWT...");
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new ApiError(401, "No Token Provided in cookie");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Unauthorized Access");
  }
};
