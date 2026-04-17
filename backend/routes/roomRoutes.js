const express = require("express");
const router = express.Router();
const {
  getMyRoom,
  getAvailableRooms,
  createPreference,
} = require("../controllers/roomController");

router.get("/my-room/:studentId", getMyRoom);
router.get("/available", getAvailableRooms);
router.post("/preference", createPreference);

module.exports = router;