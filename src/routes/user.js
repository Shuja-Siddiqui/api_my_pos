const router = require("express").Router();
const { User } = require("../handlers");

const handler = new User();

router.post("/", handler.createProfile);
router.get("/", handler.getAllUsers);
router.post("/login", handler.login);
router.delete("/:user_id", handler.deleteUser);
router.put("/:user_id",handler.updateUser)

module.exports = router;
