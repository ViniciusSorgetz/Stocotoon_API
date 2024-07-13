const express = require("express");
const router = express.Router();
const TeamController = require("../controllers/TeamController");
const checkTokenByUser = require("../middleware/checkTokenByUser");
const checkToken = require("../middleware/checkToken");

router.post("/create", checkTokenByUser, TeamController.create);
router.get("/:UserId", checkTokenByUser, TeamController.list);
router.post("/addMember", checkToken, TeamController.addMember);
router.delete("/removeMember", checkToken, TeamController.removeMember);

module.exports = router;