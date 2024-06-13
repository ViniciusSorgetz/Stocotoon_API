const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const checkToken = require("../middleware/checkToken");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/:id", checkToken, UserController.getUser);


module.exports = router;