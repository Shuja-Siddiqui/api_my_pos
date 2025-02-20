const router = require("express").Router();
const { SalesController } = require("../handlers");
const auth = require("../middleware/auth");
const refreshAuth = require("../middleware/refresh");

const handler = new SalesController();

router.post("/", auth, handler.recordSale);
router.get("/today", handler.getTodayTotalSales);
router.get("/all", handler.getAllSales);


module.exports = router;
