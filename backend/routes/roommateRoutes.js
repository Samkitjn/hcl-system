const express = require("express");
const router = express.Router();
const {
  savePreferences,
  getPotentialMatches,
  sendRoommateRequest,
} = require("../controllers/roommateController");

router.post("/preferences", savePreferences);
router.get("/matches/:studentId", getPotentialMatches);
router.post("/request", sendRoommateRequest);

module.exports = router;