import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { stripe } from "../server.js";

export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;
    if (
      !shippingInfo ||
      !orderItems ||
      !itemPrice ||
      !tax ||
      !shippingCharges ||
      !totalAmount
    ) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }
    await Order.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });
    // stock update
    for (let i = 0; i < orderItems.length; i++) {
      //   find product
      const product = await Product.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(200).send({
      success: true,
      message: "Order Created successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Create Order API Error",
      error,
    });
  }
};

export const getMyOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).send({
      success: true,
      totalOrders: orders.length,
      message: "Your Orders data is here",
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "My Orders API Error",
      error,
    });
  }
};

export const getSingleOrderController = async (req, res) => {
  try {
    //   find orders
    const orders = await Order.findById(req.params.id);
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Your orders fetch",
      orders,
    });
  } catch (error) {
    //   Cast Error
    if (error.name === "CastError") {
      res.status(500).send({
        success: false,
        message: "Invalid ID error",
      });
    }
    res.status(500).send({
      success: false,
      message: "Single order API error",
      error,
    });
  }
};

// accept payment
export const paymentsController = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    if (!totalAmount) {
      return res.status(404).send({
        success: false,
        message: "Total Amount is require",
      });
    }
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount * 100),
      currency: "usd",
    });
    res.status(200).send({
      success: true,
      client_secret,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Payments API Error",
      error,
    });
  }
};

// admin get all orders controller
export const getAdminAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).send({
      success: true,
      totalOrder: orders.length,
      message: "Get all data by admin",
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Admin get Orders API Error",
      error,
    });
  }
};

// change order status
export const changeOrderStatusController = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(401).send({
        success: false,
        message: "Order not found",
      });
    }
    if (order.orderStatus === "processing") order.orderStatus = "shipped";
    else if (order.orderStatus === "shipped") {
      order.orderStatus = "deliverd";
      order.deliveredAt = Date.now();
    } else {
      return res.status(500).send({
        success: false,
        message: "order already deliver",
      });
    }
    await order.save();
    res.status(200).send({
      success: true,
      message: "Order status updated",
    });
  } catch (error) {
    //   Cast Error
    if (error.name === "CastError") {
      res.status(500).send({
        success: false,
        message: "Invalid ID error",
      });
    }
    res.status(500).send({
      success: false,
      message: "Status Change API error",
      error,
    });
  }
};
