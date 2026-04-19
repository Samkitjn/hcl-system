const express = require("express");
const router = express.Router();
const {
  getManagementDashboardSummary,
} = require("../controllers/managementDashboardController");

router.get("/summary", getManagementDashboardSummary);

module.exports = router;