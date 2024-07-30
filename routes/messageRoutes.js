const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/MessageController");
const checkTokenByChat = require("../middleware/checkTokenByChat");

router.post("/send", checkTokenByChat, MessageController.sendMessage);

module.exports = router;