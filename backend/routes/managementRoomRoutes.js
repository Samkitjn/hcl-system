const express = require("express");
const router = express.Router();
const {
  getAllStudentsForAllocation,
  getAllRoomsForAllocation,
  allocateRoomToStudent,
} = require("../controllers/managementRoomController");

router.get("/students", getAllStudentsForAllocation);
router.get("/rooms", getAllRoomsForAllocation);
router.post("/allocate", allocateRoomToStudent);

module.exports = router;