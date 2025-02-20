// utils/rollover.js

const cron = require("node-cron");
const DailySales = require("../models/DailySales");

const rolloverDailySales = () => {
  // Schedule the task to run at 00:00 (midnight) every day
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running daily sales rollover task...");

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find today's sales
      const todaySales = await DailySales.findOne({ date: today });

      if (todaySales) {
        // Optionally, you can store yesterday's sales elsewhere or keep them as historical data
        // For simplicity, we'll just reset today's sales

        // Optionally, archive the sales
        // await ArchiveDailySales.create(todaySales.toObject());

        // Reset today's sales
        todaySales.totalSales = 0;
        todaySales.totalTransactions = 0;
        await todaySales.save();

        console.log("Daily sales rolled over successfully.");
      } else {
        // If there's no sales today, create a new DailySales document for the new day
        const newDailySales = new DailySales({
          date: today,
          totalSales: 0,
          totalTransactions: 0,
        });
        await newDailySales.save();

        console.log(
          "No sales today. Created new DailySales document for the day."
        );
      }
    } catch (error) {
      console.error("Error during daily sales rollover:", error);
    }
  });
};

module.exports = rolloverDailySales;
