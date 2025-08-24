import { Router } from "express";
import {
  uploadMultipleImages,
  uploadProductImages,
  uploadSingleImage,
  deleteImageByUrl,
  deleteImage,
} from "../Controllers/upload.controller.js";
import {
  uploadSingle,
  uploadMultiple,
  uploadProductImages as uploadProductImagesMiddleware,
} from "../middlewares/upload.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post("/single", verifyJWT, verifyAdmin, uploadSingle, uploadSingleImage);
router.post(
  "/multiple",
  verifyJWT,
  verifyAdmin,
  uploadMultiple,
  uploadMultipleImages
);
router.post(
  "/product",
  verifyJWT,
  verifyAdmin,
  uploadProductImagesMiddleware,
  uploadProductImages
);

router.delete("/:publicId", verifyJWT, verifyAdmin, deleteImage);
router.delete("/by-url", verifyJWT, verifyAdmin, deleteImageByUrl);

export default router;
