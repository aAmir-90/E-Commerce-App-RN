import cloudinary from "cloudinary";
import { Product } from "../models/productModel.js";
import { getDataUri } from "../utils/features.js";

// Get all product
export const getAllProductController = async (req, res) => {
  const { keyword, category } = req.query;
  try {
    const products = await Product.find({
      name: {
        $regex: keyword ? keyword : "",
        $options: "i",
      },
      // category: category ? category : undefined,
    });
    res.status(200).send({
      success: true,
      message: "Products get successfully",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Get all Products API error",
      error,
    });
  }
};

// get top product
export const getTopProductsController = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.status(200).send({
      success: true,
      message: "Top 3 Products",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Get top Products API error",
      error,
    });
  }
};

// Get by ID
export const getSingleProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product Found",
      product,
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
      message: "Get Single Product API error",
      error,
    });
  }
};

// Create Product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    // if (!name || !description || !price || !stock || !category) {
    //   return res.status(500).send({
    //     success: false,
    //     message: "Please provide all fields",
    //   });
    // }
    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    await Product.create({
      name,
      description,
      price,
      stock,
      category,
      images: [image],
    });
    res.status(201).send({
      success: true,
      message: "Product Created successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Get all Products API error",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not Found",
      });
    }
    const { name, description, price, stock, category } = req.body;
    // validate and update
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Details Updated",
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
      message: "Product update API error",
      error,
    });
  }
};

// Update Paroduct image
export const updateProductImageController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    // validation
    if (!product) {
      return res.status(500).send({
        success: false,
        message: "Product not found",
      });
    }
    // check file
    if (!req.file) {
      return res.status(404).send({
        success: false,
        message: "Product Image not found",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    product.images.push(image);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product image updated successfully",
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
      message: "Product update API error",
      error,
    });
  }
};

// delete product image
export const deleteProductImageController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    // imgae id find
    const id = req.query.id;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "ID not found",
      });
    }
    let isExist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) isExist = index;
    });
    if (isExist < 0) {
      return res.status(404).send({
        success: false,
        message: "image not found",
      });
    }
    //   Delete Product Image
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist, 1);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Image Deleted Successfully",
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
      message: "Product Delete API error",
      error,
    });
  }
};

// delete product
export const deleteProductController = async (req, res) => {
  try {
    //   find product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product nor found",
      });
    }
    // find and delete from cloudinary
    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    res.status(200).send({
      success: true,
      message: "Product DELETED Successfully",
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
      message: "Product Delete API error",
      error,
    });
  }
};

// create product Review and comment
export const productReviewController = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    // find
    const product = await Product.findById(req.params.id);
    // check prev review
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).send({
        success: false,
        message: "Product already reviewed",
      });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // passing review object to reviews array
    product.reviews.push(review);

    // number of reviews
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // save
    await product.save();
    res.status(200).send({
      success: true,
      message: "Review Added!!",
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
      message: "Product Review and Comment API error",
      error,
    });
  }
};
