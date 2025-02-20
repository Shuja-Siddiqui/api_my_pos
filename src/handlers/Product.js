// controllers/ProductController.js

const Response = require("./Response");
const { ProductModel } = require("../models/ProductModel");

class ProductController extends Response {
  // Create Product
  createProduct = async (req, res) => {
    try {
      const {
        name,
        category,
        price,
      } = req.body;

      // Create new product
      const newProduct = new ProductModel({
        name,
        category,
        price,
      });

      await newProduct.save();

      return this.sendResponse(req, res, {
        data: { product: newProduct },
        message: "Product added successfully",
        status: 201,
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "Product Not Added!",
        status: 500,
      });
    }
  };

  // Get All Products
  getAllProducts = async (req, res) => {
    try {
      const products = await ProductModel.find()
        .populate("category", "name") // Populate category name
        .sort({ name: 1 }); // Sort alphabetically

      return this.sendResponse(req, res, {
        data: products,
        message: "Products retrieved successfully",
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to retrieve products",
        status: 500,
      });
    }
  };

  // Get Single Product by ID
  getProductById = async (req, res) => {
    try {
      const productId = req.params.id;

      const product = await ProductModel.findById(productId).populate(
        "category",
        "name"
      );
      if (!product) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Product not found",
          status: 404,
        });
      }

      return this.sendResponse(req, res, {
        data: product,
        message: "Product retrieved successfully",
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to retrieve product",
        status: 500,
      });
    }
  };

  // Update Product
  updateProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const { updatedData } = req.body;

      // Find the product by ID
      const product = await ProductModel.findById(productId);
      if (!product) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Product not found",
          status: 404,
        });
      }

      // If SKU is being updated, check for uniqueness
      // if (sku && sku.toUpperCase() !== product.sku) {
      //   const existingSKU = await ProductModel.findOne({
      //     sku: sku.toUpperCase(),
      //   });
      //   if (existingSKU) {
      //     return this.sendResponse(req, res, {
      //       data: null,
      //       message: "Another product with the same SKU already exists",
      //       status: 400,
      //     });
      //   }
      //   product.sku = sku.toUpperCase();
      // }
      // Update other fields if provided
      if ( updatedData?.name) product.name = updatedData?.name;
      if ( updatedData?.dosage) product.dosage = updatedData?.dosage;
      // if (description) product.description = description;
      if (updatedData?.category) product.category = updatedData?.category;
      // if (brand) product.brand = brand;
      // if (genericName) product.genericName = genericName;
      if (updatedData?.price !== undefined) product.price = updatedData?.price;
      // if (discount !== undefined) product.discount = discount;
      if (updatedData?.stock !== undefined) product.stock = updatedData?.stock;
      // if (reorderLevel !== undefined) product.reorderLevel = reorderLevel;
      // if (expiryDate) product.expiryDate = expiryDate;

      await product.save();

      return this.sendResponse(req, res, {
        data: { product },
        message: "Product updated successfully",
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to update product",
        status: 500,
      });
    }
  };

  // Delete Product
  deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id;

      const product = await ProductModel.findById(productId);
      if (!product) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Product not found",
          status: 404,
        });
      }

      await ProductModel.deleteOne({ _id: productId });

      return this.sendResponse(req, res, {
        data: null,
        message: "Product deleted successfully",
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to delete product",
        status: 500,
      });
    }
  };
}

module.exports = { ProductController };
