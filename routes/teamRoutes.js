const express = require("express");
const router = express.Router();
const TeamController = require("../controllers/TeamController");
const checkTokenByUser = require("../middleware/checkTokenByUser");
const checkTokenByTeam = require("../middleware/checkTokenByTeam");

router.post("/create", checkTokenByUser, TeamController.create);
router.get("/:UserId", checkTokenByUser, TeamController.list);
router.post("/:TeamId/addMember", checkTokenByTeam, TeamController.add);

module.exports = router;