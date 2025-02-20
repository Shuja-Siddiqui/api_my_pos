const router = require("express").Router();
const { ProductController } = require("../handlers");
const auth = require("../middleware/auth");
const refreshAuth = require("../middleware/refresh");

const handler = new ProductController();

router.post("/", refreshAuth, auth, handler.createProduct);
router.get("/", handler.getAllProducts);
router.get("/by-id/:id", handler.getProductById);
router.put("/by-id/:id", refreshAuth, auth, handler.updateProduct);
router.delete("/by-id/:id", handler.deleteProduct);

module.exports = router;
