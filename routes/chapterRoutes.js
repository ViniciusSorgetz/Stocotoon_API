const express = require("express");
const router = express.Router();
const ChapterController = require("../controllers/ChapterController");
const checkTokenByUser = require("../middleware/checkTokenByUser");

module.exports = router;

router.post("/create", checkTokenByUser, ChapterController.create);