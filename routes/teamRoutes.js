const express = require("express");
const router = express.Router();
const TeamController = require("../controllers/TeamController");
const checkTokenByUser = require("../middleware/checkTokenByUser");

router.post("/create", checkTokenByUser, TeamController.create);
router.get("/:UserId", checkTokenByUser, TeamController.list);

module.exports = router;