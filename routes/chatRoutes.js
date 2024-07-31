const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");
const checkTokenByTeam = require("../middleware/checkTokenByTeam");
const checkTokenByChat2 = require("../middleware/checkTokenByChat2");

router.get("/:ChatId", checkTokenByChat2, ChatController.getInfo);
router.post("/create", checkTokenByTeam, ChatController.create);

module.exports = router;