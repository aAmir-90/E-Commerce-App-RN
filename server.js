import express from "express";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import Stripe from "stripe";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

// dotenv config;
dotenv.config();

// Database call
connectDB();

// stripe config
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

// cloudinar config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Rest API
const app = express();

// Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Route Imports
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/order", orderRoutes);

app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Welcome to Home Page of E-Commerce App",
  });
});

// PORT
const PORT = process.env.PORT || 3000;

// Server Listen
app.listen(PORT, () => {
  console.log(
    `Server is running on ${PORT} port on ${process.env.NODE_ENV} mode`
  );
});
