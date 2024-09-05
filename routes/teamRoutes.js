const express = require("express");
const router = express.Router();
const TeamController = require("../controllers/TeamController");
const checkTokenByUser = require("../middleware/checkTokenByUser");
const checkTokenByTeam = require("../middleware/checkTokenByTeam")
const checkToken = require("../middleware/checkToken");

router.post("/create", checkTokenByUser, TeamController.create);
router.get("/:TeamId", checkTokenByTeam, TeamController.getInfo);
router.get("/:TeamId/amount", checkTokenByTeam, TeamController.getAmount);
router.get("/:TeamId/members", checkTokenByTeam, TeamController.getMembers);
router.put("/:TeamId", checkTokenByTeam, TeamController.edit);
router.post("/addMember", checkToken, TeamController.addMember);
router.delete("/removeMember", checkToken, TeamController.removeMember);

module.exports = router;