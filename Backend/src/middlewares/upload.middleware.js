import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ons-store",
    allowed_formats: ["jpeg", "jpg", "png", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, res, cb) => {
    if (file.mimetype.startWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "only images files are allowed !"), false);
    }
  },
});

export const uploadSingle = upload.single("image");

export const uploadMultiple = upload.array("images", 5);

export const uploadProductImages = upload.fields([
  { name: "images", maxCount: 1 }, //main product image
  { name: "images", maxCount: 4 }, //additional images
]);

export const deleteFromCloudinary = asyncHandler(async (publicId) => {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
});

export const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.split(".")[0];
};

export const uploadBase64Image = asyncHandler(
  async (base64string, folder = "ons-store") => {
    const result = await cloudinary.uploader.upload(base64string, {
      folder: folder,
      transformation: [
        { width: 800, height: 800, crop: "limit" },
        { quality: "auto" },
      ],
    });

    return result;
  }
);

export { cloudinary };
