const express = require("express");
const router = express.Router();
const PageController = require("../controllers/PageController");
const checkTokenByChapter = require("../middleware/checkTokenByChapter");

module.exports = router;

router.post("/create", checkTokenByChapter, PageController.create)