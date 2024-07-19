import express from "express";
import {
  getUserProfileController,
  loginController,
  logoutController,
  passwordResetController,
  registerController,
  updatePasswordController,
  updateProfileController,
  updateProfilePicController,
} from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
import { rateLimit } from "express-rate-limit";

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// router object
const router = express.Router();

// routes
// /Register User
router.post("/register", limiter, registerController);

// Login User
router.post("/login", limiter, loginController);

// Profile
router.get("/profile", isAuth, getUserProfileController);

// Logout
router.get("/logout", isAuth, logoutController);

// Update Profile
router.put("/profile-update", isAuth, updateProfileController);

// Update Password
router.put("/update-password", isAuth, updatePasswordController);

// Update Profile Picture
router.put("/update-picture", isAuth, singleUpload, updateProfilePicController);

// Forgot password
router.post("/reset-password", passwordResetController);

export default router;
