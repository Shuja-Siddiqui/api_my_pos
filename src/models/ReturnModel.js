// models/Sale.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const returnSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      required: true,
    },
    totalReturnPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    returnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const ReturnModel = new mongoose.model("Return", returnSchema);
module.exports = { ReturnModel };
