const Response = require("./Response");
const { SaleModel } = require("../models/SaleModel");
const { ProductModel } = require("../models");
const { DailySaleModel } = require("../models");
const { default: mongoose } = require("mongoose");

class SalesController extends Response {
  // Record a new sale
  recordSale = async (req, res) => {
    try {
      const { products, customerName } = req.body; // `products` should be an array of { productId, quantity } objects.
      // Validate input
      if (!Array.isArray(products) || products.length === 0) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Products array is required and cannot be empty",
          status: 400,
        });
      }

      let totalSaleAmount = 0;
      let saleRecords = [];

      try {
        for (const item of products) {
          const { productId, quantity } = item;

          if (!productId || !quantity || quantity <= 0) {
            return this.sendResponse(req, res, {
              data: null,
              message:
                "Each product must have a valid product ID and a positive quantity",
              status: 400,
            });
          }

          // Fetch product
          const product = await ProductModel.findById(productId);
          if (!product) {
            return this.sendResponse(req, res, {
              data: null,
              message: `Product with ID ${productId} not found`,
              status: 404,
            });
          }

          // Check stock
          if (product.stock < quantity) {
            return this.sendResponse(req, res, {
              data: null,
              message: `Insufficient stock for ${product?.name}`,
              status: 400,
            });
          }

          // Calculate total price
          const priceAtSale = product.price;
          const totalPrice = priceAtSale * quantity;

          // Create sale record
          const sale = new SaleModel({
            product: product._id,
            quantity,
            priceAtSale,
            totalPrice,
            customerName: customerName?.name,
          });
          await sale.save();
          saleRecords.push(sale);

          // Update product stock
          product.stock -= quantity;
          await product.save();

          totalSaleAmount += totalPrice;
        }

        // Update DailySales
        const today = new Date();
        today.setHours(11, 0, 0, 0); // Normalize to midnight

        const dailySales = await DailySaleModel.findOne({
          date: today,
        });
        if (dailySales) {
          dailySales.totalSales += totalSaleAmount;
          dailySales.totalTransactions += products.length;
          await dailySales.save();
        } else {
          // Create a new DailySales document for today
          const newDailySales = new DailySaleModel({
            date: today,
            totalSales: totalSaleAmount,
            totalTransactions: products.length,
          });
          await newDailySales.save();
        }

        console.log(saleRecords);

        return this.sendResponse(req, res, {
          data: { saleRecords },
          message: "Sales recorded successfully",
          status: 201,
        });
      } catch (error) {
        console.error(error);
        return this.sendResponse(req, res, {
          data: null,
          message: "Failed to record sales",
          status: 500,
        });
      }
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "An unexpected error occurred",
        status: 500,
      });
    }
  };

  getTodayTotalSales = async (req, res) => {
    try {
      const today = new Date();
      today.setHours(11, 0, 0, 0); // Normalize to midnight
      const dailySales = await DailySaleModel.findOne({ date: today });
      const totalSales = dailySales ? dailySales.totalSales : 0;

      return this.sendResponse(req, res, {
        data: { totalSales },
        message: "Today's total sales retrieved successfully",
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to retrieve today's total sales",
        status: 500,
      });
    }
  };

  // Get all sales (optional, with filtering)
  getAllSales = async (req, res) => {
    try {
      const sales = await SaleModel.find()
        .populate("product", "name price")
        .sort({ soldAt: -1 });
      return this.sendResponse(req, res, {
        data: sales,
        message: "All sales retrieved successfully",
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to retrieve sales",
        status: 500,
      });
    }
  };
}

module.exports = { SalesController };
