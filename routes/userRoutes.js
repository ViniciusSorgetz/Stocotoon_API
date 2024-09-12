const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const checkToken = require("../middleware/checkToken");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/:UserId", checkToken, upload.single("image"), UserController.edit)
router.get("/:UserId", checkToken, UserController.getInfo);

module.exports = router;