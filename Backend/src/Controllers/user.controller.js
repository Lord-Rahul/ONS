import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { api, options } from "../constants.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { response } from "express";
import { sendWelcomeEmail } from "../services/email.service.js";

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

  await sendWelcomeEmail(createdUser);

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

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  return res
    .status(200, "")
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "password is required ");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "password must be 6 character long");
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "wrong old password ");
  }

  const isSamePassword = await user.isPasswordCorrect(newPassword);

  if (isSamePassword) {
    throw new ApiError(400, "new password cannot be same as old password ");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "password is changed "));
});

const update = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const { fullName, email, number, address1, address2, city, pincode, state } =
    body;

  if (
    !fullName &&
    !email &&
    !number &&
    !address1 &&
    !address2 &&
    !city &&
    !pincode &&
    !state
  ) {
    throw new ApiError(400, "atleast one field is required");
  }

  const updateFields = {};
  if (fullName) updateFields.fullName = fullName;
  if (email) updateFields.email = email.toLowerCase();
  if (number) updateFields.number = number;
  if (address1) updateFields.address1 = address1;
  if (address2) updateFields.address2 = address2;
  if (city) updateFields.city = city;
  if (pincode) updateFields.pincode = pincode;
  if (state) updateFields.state = state;

  if (email || number) {
    const existingUser = await User.findOne({
      $and: [{ _id: { $ne: req.user._id } }, { $or: [{ email }, { number }] }],
    });

    if (existingUser) {
      throw new ApiError(409, "Email or Phone number already exists");
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updateFields },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user details updated successfully "));
});

export {
  generateAccessAndRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  changeUserPassword,
  update,
};
