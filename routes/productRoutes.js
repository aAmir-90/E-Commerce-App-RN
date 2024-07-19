import express from "express";
import {
  createProductController,
  deleteProductController,
  deleteProductImageController,
  getAllProductController,
  getSingleProductController,
  getTopProductsController,
  productReviewController,
  updateProductController,
  updateProductImageController,
} from "../controllers/productController.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();

// Routes
router.get("/get-all", );

// get top products
router.get("/top", getTopProductsController);

// Get by ID
router.get("/:id", getSingleProductController);

// Create Product
router.post("/create", isAuth, isAdmin, singleUpload, createProductController);

// Update Product
router.put("/:id", isAuth, isAdmin, updateProductController);

// Update Product Image
router.put(
  "/image/:id",
  isAuth,
  isAdmin,
  singleUpload,
  updateProductImageController
);

// delete product image
router.delete(
  "/delete-image/:id",
  isAuth,
  isAdmin,
  deleteProductImageController
);

// delete product image
router.delete("/delete/:id", isAuth, isAdmin, deleteProductController);

// Review Product
router.put("/:id/review", isAuth, productReviewController)

export default router;
