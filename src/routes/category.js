const router = require("express").Router();
const { CategoryController } = require("../handlers");
const auth = require("../middleware/auth");

const handler = new CategoryController();

router.post("/", auth, handler.createCategory);
router.get("/", handler.getAllCategories);
router.get("/by-id/:id", handler.getCategoryById);
router.delete("/by-id/:id", handler.deleteCategory);

module.exports = router;
