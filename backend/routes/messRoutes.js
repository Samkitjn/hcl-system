const express = require("express");
const router = express.Router();
const {
  getMessMenu,
  submitMessFeedback,
  getMessCharges,
} = require("../controllers/messController");

router.get("/menu", getMessMenu);
router.post("/feedback", submitMessFeedback);
router.get("/charges/:studentId", getMessCharges);

module.exports = router;