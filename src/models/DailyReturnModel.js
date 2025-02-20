// models/DailyReturn.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const dailyReturnSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    totalReturns: {
      type: Number,
      required: true,
      default: 0,
    },
    returns: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        returnAmount: { type: Number, required: true },
      },
    ],
    isPrevious: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const DailyReturnModel = new mongoose.model("DailyReturn", dailyReturnSchema);
module.exports = { DailyReturnModel };
