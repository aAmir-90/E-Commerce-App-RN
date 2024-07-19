import { Category } from "../models/categoryModel.js";
import { Product } from "../models/productModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    await Category.create({ category });
    res.status(200).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Create Category API Error",
      error,
    });
  }
};

export const getAllCategoryController = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send({
      success: true,
      message: "Categories get successfully",
      totalCat: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Get all Category API Error",
      error,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    // find product with this category id
    const products = await Product.find({ category: category._id });
    // update product category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }
    await category.deleteOne();
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
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
      message: "Category Delete API error",
      error,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category Not Found",
      });
    }
    // GEt new Categroy
    const { updateCategory } = req.body;
    // find products with this category ID
    const products = await Product.find({ category: category._id });
    // update products category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updateCategory;
      await product.save();
    }

    if (updateCategory) category.category = updateCategory;
    await category.save();
    res.status(200).send({
      success: true,
      message: "Category Updated successfully",
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
      message: "Category Update API error",
      error,
    });
  }
};
