import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "authentication required ");
  }

  if (!req.user.isAdmin) {
    throw new ApiError(403, "Access denied. Admin privileges required ");
  }

  next();
});
