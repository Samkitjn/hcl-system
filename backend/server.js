const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const studentAuthRoutes = require("./routes/studentAuthRoutes");
const managementAuthRoutes = require("./routes/managementAuthRoutes");
const roomRoutes = require("./routes/roomRoutes");
const messRoutes = require("./routes/messRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const communityRoutes = require("./routes/communityRoutes");
const roommateRoutes = require("./routes/roommateRoutes");
const managementStudentRoutes = require("./routes/managementStudentRoutes");
const managementRoomRoutes = require("./routes/managementRoomRoutes");
const managementLeaveRoutes = require("./routes/managementLeaveRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HCL backend running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Database connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("DB test error:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.use("/api/auth/student", studentAuthRoutes);
app.use("/api/auth/management", managementAuthRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/mess", messRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/roommate", roommateRoutes);
app.use("/api/management/students", managementStudentRoutes);
app.use("/api/management/rooms", managementRoomRoutes);
app.use("/api/management/leave", managementLeaveRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});