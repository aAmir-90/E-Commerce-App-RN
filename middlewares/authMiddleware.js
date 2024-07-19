import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// User Authentication
export const isAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
  const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decodeToken._id);
  next();
};

// Admin Authentication
export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).send({
      success: false,
      message: "Admin Only",
    });
  }
  next();
};
