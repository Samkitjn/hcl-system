const express = require("express");
const router = express.Router();
const {
  getPendingStudents,
  approveStudent,
} = require("../controllers/managementStudentController");

router.get("/pending", getPendingStudents);
router.put("/approve/:id", approveStudent);

module.exports = router;