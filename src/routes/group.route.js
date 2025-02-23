const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group.controller");

router.get("/", groupController.getAllGroups);
router.post("/", groupController.createGroup);
router.post("/join", groupController.joinGroup);

module.exports = router;
