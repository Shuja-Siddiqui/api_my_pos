// controllers/CategoryController.js

const { CategoryModel } = require("../models");
const Response = require("./Response");

class CategoryController extends Response {
  // Create Category
  createCategory = async (req, res) => {
    try {
      const { name } = req.body;
      // Validate input
      if (!name || name.trim().length === 0) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Category name is required",
          status: 400,
        });
      }

      // Check if category already exists
      const existingCategory = await CategoryModel.findOne({
        name: name.toLowerCase(),
      });
      if (existingCategory) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Category already exists",
          status: 400,
        });
      }

      const newName = name.toLowerCase();
      const newCategory = new CategoryModel({ name: newName });
      await newCategory.save();

      return this.sendResponse(req, res, {
        data: { category: newCategory },
        message: "Category added successfully",
        status: 201,
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "Category Not Added!",
        status: 500,
      });
    }
  };

  // Get All Categories
  getAllCategories = async (req, res) => {
    try {
      const categories = await CategoryModel.find().sort({ name: 1 }); // Sort alphabetically

      return this.sendResponse(req, res, {
        data: categories,
        message: "Categories retrieved successfully",
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to retrieve categories",
        status: 500,
      });
    }
  };

  // Get Single Category by ID
  getCategoryById = async (req, res) => {
    try {
      const categoryId = req.params.id;

      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Category not found",
          status: 404,
        });
      }

      return this.sendResponse(req, res, {
        data: category,
        message: "Category retrieved successfully",
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to retrieve category",
        status: 500,
      });
    }
  };

  // Update Category
  updateCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const { name } = req.body;

      // Validate input
      if (!name || name.trim().length === 0) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Category name is required",
          status: 400,
        });
      }

      // Check if category exists
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Category not found",
          status: 404,
        });
      }

      // Check for duplicate category name
      if (name.toLowerCase() !== category.name) {
        const existingCategory = await CategoryModel.findOne({
          name: name.toLowerCase(),
        });
        if (existingCategory) {
          return this.sendResponse(req, res, {
            data: null,
            message: "Another category with the same name already exists",
            status: 400,
          });
        }
      }

      // Update category name (will be saved in lowercase)
      category.name = name;
      await category.save();

      return this.sendResponse(req, res, {
        data: { category },
        message: "Category updated successfully",
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to update category",
        status: 500,
      });
    }
  };

  // Delete Category
  deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;

      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Category not found",
          status: 404,
        });
      }

      await CategoryModel.deleteOne({ _id: categoryId });

      return this.sendResponse(req, res, {
        data: null,
        message: "Category deleted successfully",
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to delete category",
        status: 500,
      });
    }
  };
}

module.exports = { CategoryController };
