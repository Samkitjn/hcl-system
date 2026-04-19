const express = require("express");
const router = express.Router();
const {
  getMessManagementData,
  addMessCharge,
} = require("../controllers/managementMessController");

router.get("/", getMessManagementData);
router.post("/charge", addMessCharge);

module.exports = router;