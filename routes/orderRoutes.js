import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
  changeOrderStatusController,
  createOrderController,
  getAdminAllOrdersController,
  getMyOrdersController,
  getSingleOrderController,
  paymentsController,
} from "../controllers/orderController.js";
const router = express.Router();

// create order
router.post("/create", isAuth, createOrderController);

// get my order
router.get("/my-order", isAuth, getMyOrdersController);

// get single orders details
router.get("/my-order/:id", isAuth, getSingleOrderController);

// accept Payment
router.post("/payments", isAuth, paymentsController);

// =============== ADMIN PART ============
// admin part get all order
router.get(
  "/admin/get-all-orders",
  isAuth,
  isAdmin,
  getAdminAllOrdersController
);

// change order status
router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);

export default router;
