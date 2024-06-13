const express = require("express");
const router = express.Router();
const ScriptController = require("../controllers/ScriptController");
const checkTokenByPage = require("../middleware/checkTokenByPage")

module.exports = router;

router.post("/create", checkTokenByPage, ScriptController.create);