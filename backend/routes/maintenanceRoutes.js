const express = require("express");
const router = express.Router();
const {
  createMaintenanceRequest,
  getStudentMaintenanceRequests,
} = require("../controllers/maintenanceController");

router.post("/create", createMaintenanceRequest);
router.get("/student/:studentId", getStudentMaintenanceRequests);

module.exports = router;