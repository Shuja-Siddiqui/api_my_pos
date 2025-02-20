// controllers/ReturnController.js

const Response = require("./Response");
const {
  ReturnModel,
  ProductModel,
  SaleModel,
  DailySaleModel,
} = require("../models");
const { DailyReturnModel } = require("../models");

const responseHandler = new Response();

class ReturnController extends Response {
  createReturn = async (req, res) => {
    try {
      const { product, quantity, returnPrice, reason } = req.body;

      if (!product || !quantity || quantity <= 0 || !returnPrice) {
        return responseHandler.sendResponse(req, res, {
          data: null,
          message: "Product, positive quantity, and return price are required",
          status: 400,
        });
      }

      const productRecord = await ProductModel.findById(product);
      if (!productRecord) {
        return responseHandler.sendResponse(req, res, {
          data: null,
          message: "Product not found",
          status: 404,
        });
      }

      // Create return record
      const newReturn = new ReturnModel({
        reason,
        product,
        quantity,
        returnPrice,
        totalReturnPrice: quantity * returnPrice,
      });

      await newReturn.save();

      const stock = Number(productRecord.stock);
      if (isNaN(stock)) {
        return responseHandler.sendResponse(req, res, {
          data: null,
          message: "Invalid product stock value",
          status: 500,
        });
      }
      productRecord.stock = stock + parseInt(quantity);
      await productRecord.save();

      await this.updateDailyReturns(quantity * returnPrice, product, quantity);
      // const today = new Date();
      // today.setHours(11, 0, 0, 0);
      // const sale = await DailySaleModel.findOne({ date: today });
      // sale.totalSales -= quantity * returnPrice;
      // await sale.save();
      return responseHandler.sendResponse(req, res, {
        data: newReturn,
        message: "Return recorded successfully",
        status: 201,
      });
    } catch (error) {
      console.error(error);
      return responseHandler.sendResponse(req, res, {
        data: null,
        message: "Failed to record return",
        status: 500,
      });
    }
  };

  updateDailyReturns = async (returnAmount, product, quantity) => {
    const today = new Date();
    today.setHours(11, 0, 0, 0); // Set today to 11 a.m.

    const dailyReturn = await DailyReturnModel.findOne({ date: today });

    if (dailyReturn) {
      // Add return details to the returns array
      dailyReturn.returns.push({
        product,
        quantity,
        returnAmount,
      });

      // Update the total returns
      const a = (dailyReturn.totalReturns += parseInt(returnAmount));
      await dailyReturn.save();
    } else {
      // Mark the latest record as previous
      const yesterday = await DailyReturnModel.findOne().sort({ date: -1 });
      if (yesterday) {
        yesterday.isPrevious = true;
        await yesterday.save();
      }

      const newDailyReturn = new DailyReturnModel({
        date: today,
        totalReturns: returnAmount,
        returns: [{ product, quantity, returnAmount }],
      });
      await newDailyReturn.save();
    }
  };

  getAllReturnProducts = async (req, res) => {
    try {
      const products = await ReturnModel.find()
        .populate("product", "name") // Populate category name
        .sort({ returnedAt: -1 }); // Sort alphabetically
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
  getTodayReturnProducts = async (req, res) => {
    const today = new Date();
    today.setHours(11, 0, 0, 0);
    try {
      const sale = await DailyReturnModel.findOne({ date: today });
      // const products = await DailyReturnModel.find()
        // .populate("product", "name") // Populate category name
        // .sort({ returnedAt: -1 }); // Sort alphabetically
        console.log(sale)
      return this.sendResponse(req, res, {
        data: sale,
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
}
module.exports = { ReturnController };
