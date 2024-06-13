const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const PictureController = require("../controllers/PictureController");
const checkTokenByPage = require("../middleware/checkTokenByPage");

router.post("/create", upload.single("picture"),  PictureController.create);

module.exports = router;