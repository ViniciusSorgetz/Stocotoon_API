const express = require("express");
const router = express.Router();
const PageController = require("../controllers/PageController");

module.exports = router;

router.post("/create", PageController.create)