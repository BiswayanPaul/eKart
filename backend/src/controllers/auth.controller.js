import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  try {
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
    throw new ApiError(500, "Token generation failed");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password, role } = req.body;
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
      role,
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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(401, "You don't have an account yet.");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Wrong Password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const userData = user.toJSON();

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { user: userData, accessToken, refreshToken },
          "Login Successful"
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Login failed");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  await User.findOneAndUpdate({ _id }, { refreshToken: null });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, null, "Logout Successful"));
});

// REFRESH TOKEN

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token not found, login again");
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decoded._id);

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token, login again");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  await User.findByIdAndUpdate(user._id, { refreshToken });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            email: user.email,
          },
          accessToken,
          refreshToken,
        },
        "Token refreshed successfully"
      )
    );
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
