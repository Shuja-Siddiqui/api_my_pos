const router = require("express").Router();
const { ReturnController } = require("../handlers");
const auth = require("../middleware/auth");
// const refreshAuth = require("../middleware/refresh");

const handler = new ReturnController();

router.post("/",  auth, handler.createReturn);
router.get("/",  handler.getAllReturnProducts);
router.get("/today",  handler.getTodayReturnProducts);

module.exports = router;
