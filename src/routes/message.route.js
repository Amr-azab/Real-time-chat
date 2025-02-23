const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");

router.get("/private/:username", messageController.getPrivateMessages);
router.get("/group/:groupName", messageController.getGroupMessages);

module.exports = router;
