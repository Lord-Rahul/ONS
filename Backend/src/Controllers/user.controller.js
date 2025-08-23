import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (e) {
    throw new ApiError(500, "something went wrong while generating token ");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, number } = req.body;

  if (
    [fullName, email, password, number].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required ");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { number }],
  });

  if (existedUser) {
    throw new ApiError(409, "user with email or phone already exists");
  }

  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    password,
    number,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user ");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user is registered sucessfully "));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, number } = req.body;

  if (!email && !number) {
    throw new ApiError(400, "email or number is required");
  }
  if (!password) {
    throw new ApiError(400, "password is required ");
  }

  const user = await User.findOne({
    $or: [{ email }, { number }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exist ");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid credentials !");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully "
      )
    );
});

export { generateAccessAndRefreshToken, registerUser ,loginUser};
