const express = require("express");
const router = express.Router();
const StoryController = require("../controllers/StoryController");
const checkTokenByTeam = require("../middleware/checkTokenByTeam");

router.post("/create", checkTokenByTeam,  StoryController.create);
router.get("/TeamId", checkTokenByTeam, StoryController.list)

module.exports = router;