const express = require("express");
const router = express.Router();
const ChapterController = require("../controllers/ChapterController");
const checkTokenByStory = require("../middleware/checkTokenByStory");

router.post("/create", checkTokenByStory, ChapterController.create);
router.get("/:StoryId", checkTokenByStory, ChapterController.list);

module.exports = router;