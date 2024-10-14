const express = require("express");
const router = express.Router();
const PageController = require("../controllers/PageController");
const checkTokenByChapter = require("../middleware/checkTokenByChapter");
const checkTokenByPage = require("../middleware/checkTokenByPage");

module.exports = router;

router.post("/create", checkTokenByChapter, PageController.create);
router.put("/:PageId", checkTokenByPage, PageController.edit);
router.delete("/:PageId", checkTokenByPage, PageController.delete);