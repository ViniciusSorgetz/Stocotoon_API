const express = require("express");
const router = express.Router();
const PictureController = require("../controllers/PictureController");
const checkTokenByPage = require("../middleware/checkTokenByPage");

router.get("/:PageId", checkTokenByPage, PictureController.getContent);
router.put("/save", checkTokenByPage, PictureController.save);

module.exports = router;