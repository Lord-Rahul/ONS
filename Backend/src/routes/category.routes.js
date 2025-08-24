import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
} from "../Controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/").get(getAllCategories);
router.route("/:id").get(getCategoryById);

router.route("/").post(verifyJWT, verifyAdmin, addCategory);
router.route("/:id").put(verifyJWT, verifyAdmin, updateCategory);
router.route("/:id").delete(verifyJWT, verifyAdmin, deleteCategory);

export default router;
