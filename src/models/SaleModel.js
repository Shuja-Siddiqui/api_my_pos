// models/Sale.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const saleSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtSale: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    soldAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const SaleModel = new mongoose.model("Sale", saleSchema);
module.exports = { SaleModel };
