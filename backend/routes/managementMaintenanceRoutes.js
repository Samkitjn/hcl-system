const express = require("express");
const router = express.Router();
const {
  getAllMaintenanceRequests,
  updateMaintenanceStatus,
} = require("../controllers/managementMaintenanceController");

router.get("/", getAllMaintenanceRequests);
router.put("/:id", updateMaintenanceStatus);

module.exports = router;