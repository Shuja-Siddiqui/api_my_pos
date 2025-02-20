// models/DailySales.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const dailySalesSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    totalSales: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTransactions: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const DailySaleModel = new mongoose.model("DailySale", dailySalesSchema);
module.exports = { DailySaleModel };
