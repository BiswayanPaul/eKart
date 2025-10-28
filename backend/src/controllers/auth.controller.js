import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;
  try {
    if (!username || !email || !fullname || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "User with given email or username already exists"
      );
    }

    const newUser = await User.create({
      fullname,
      username,
      email,
      password,
    });

    const userData = newUser.toJSON();

    res
      .status(201)
      .json(
        new ApiResponse(201, { user: userData }, "User registered successfully")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Registration failed");
  }
});

export { registerUser };
