const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getStudentLeaves,
} = require("../controllers/leaveController");

router.post("/apply", applyLeave);
router.get("/student/:studentId", getStudentLeaves);

module.exports = router;