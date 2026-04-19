const express = require("express");
const router = express.Router();
const {
  getAllLeaveRequests,
  updateLeaveStatus,
} = require("../controllers/managementLeaveController");

router.get("/", getAllLeaveRequests);
router.put("/:id", updateLeaveStatus);

module.exports = router;