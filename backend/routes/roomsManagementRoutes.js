const express = require("express");
const router = express.Router();
const { getAllRooms } = require("../controllers/roomsManagementController");

router.get("/", getAllRooms);

module.exports = router;