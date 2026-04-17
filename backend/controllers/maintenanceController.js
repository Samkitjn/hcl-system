const pool = require("../config/db");

const createMaintenanceRequest = async (req, res) => {
  try {
    const { student_id, issue_type, description, room_number } = req.body;

    await pool.query(
      `INSERT INTO maintenance_requests (student_id, issue_type, description, room_number)
       VALUES ($1, $2, $3, $4)`,
      [student_id, issue_type, description, room_number]
    );

    res.json({
      success: true,
      message: "Maintenance request submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getStudentMaintenanceRequests = async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await pool.query(
      `SELECT * FROM maintenance_requests
       WHERE student_id = $1
       ORDER BY id DESC`,
      [studentId]
    );

    res.json({
      success: true,
      requests: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createMaintenanceRequest,
  getStudentMaintenanceRequests,
};