const express = require("express");
const router = express.Router();
const TeamController = require("../controllers/TeamController");
const checkTokenByUser = require("../middleware/checkTokenByUser");
const checkTokenByTeam = require("../middleware/checkTokenByTeam")
const checkToken = require("../middleware/checkToken");

router.post("/create", checkTokenByUser, TeamController.create);
router.get("/:TeamId", checkTokenByTeam, TeamController.getInfo);
router.get("/:TeamId/all", checkTokenByTeam, TeamController.getAllInfo);
router.put("/:TeamId", checkTokenByTeam, TeamController.edit);
router.post("/addMember", checkToken, TeamController.addMember);
router.post("/removeMember", checkToken, TeamController.removeMember);

module.exports = router;