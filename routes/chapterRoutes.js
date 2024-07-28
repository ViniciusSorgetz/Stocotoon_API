const express = require("express");
const router = express.Router();
const ChapterController = require("../controllers/ChapterController");
const checkTokenByStory = require("../middleware/checkTokenByStory");
const checkTokenByChapter = require ("../middleware/checkTokenByChapter");

router.post("/create", checkTokenByStory, ChapterController.create);
router.get("/:ChapterId", checkTokenByChapter, ChapterController.getInfo);

module.exports = router;