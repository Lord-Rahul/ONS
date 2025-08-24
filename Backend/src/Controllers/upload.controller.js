import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  deleteFromCloudinary,
  getPublicIdFromUrl,
  uploadMultiple,
} from "../middlewares/upload.middleware.js";

const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "no image file provided");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalName,
      },
      "image uploaded successfully"
    )
  );
});

const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "no image file provided");
  }

  const uploadedImages = req.files.map((file) => ({
    url: file.path,
    publicId: req.file.filename,
    originalName: req.file.originalName,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        images: uploadedImages,
        count: uploadedImages.length,
      },
      `${uploadedImages.length} images uploaded successfully`
    )
  );
});

const uploadProductImages = asyncHandler(async (req, res) => {
  const result = {};

  if (req.files.image && req.files.image[0]) {
    result.mainImage = {
      url: req.files.image[0].path,
      publicId: req.files.image[0].filename,
      originalName: req.files.image[0].originalname,
    };
  }

  if (req.files.image && req.files.images.length > 0) {
    result.uploadedImages = req.files.images.map((file) => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
    }));
  }

  if (!result.mainImage && !result.additionalImages) {
    throw new ApiError(400, "no image files provided");
  }

  const totalImages =
    (result.mainImage ? 1 : 0) +
    (result.additionalImages ? result.additionalImages.length : 0);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        `Product images uploaded successfully (${totalImages} files)`
      )
    );
});

const deleteImages = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  if (!publicId) {
    throw new ApiError(400, "public id is required ");
  }

  const result = await deleteFromCloudinary(publicId);

  if (result.result !== "ok") {
    throw new ApiError("400, failed to delete image ");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { publicId, deleted: true },
        "image deleted successfully "
      )
    );
});

const deleteImageByUrl = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    throw new ApiError(400, "image url is required");
  }

  const publicId = getPublicIdFromUrl(imageUrl);
  const result = deleteFromCloudinary(publicId);

  if (result.result !== "ok") {
    throw new ApiError(400, "Failed to delete image");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        imageUrl,
        publicId,
        deleted: true,
      },
      "Image deleted successfully "
    )
  );
});

export {
  uploadMultipleImages,
  uploadSingleImage,
  uploadProductImages,
  deleteImages,
  deleteImageByUrl
};
