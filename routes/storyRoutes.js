const express = require("express");
const router = express.Router();
const StoryController = require("../controllers/StoryController");
const checkTokenByTeam = require("../middleware/checkTokenByTeam");
const checkTokenByStory = require("../middleware/checkTokenByStory");

router.post("/create", checkTokenByTeam,  StoryController.create);
router.get("/:StoryId", checkTokenByStory, StoryController.getInfo)

module.exports = router;