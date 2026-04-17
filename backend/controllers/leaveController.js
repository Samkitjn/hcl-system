const pool = require("../config/db");

const applyLeave = async (req, res) => {
  try {
    const { student_id, leave_type, from_date, to_date, reason } = req.body;

    await pool.query(
      `INSERT INTO leave_requests (student_id, leave_type, from_date, to_date, reason)
       VALUES ($1, $2, $3, $4, $5)`,
      [student_id, leave_type, from_date, to_date, reason]
    );

    res.json({
      success: true,
      message: "Leave applied successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getStudentLeaves = async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await pool.query(
      `SELECT * FROM leave_requests
       WHERE student_id = $1
       ORDER BY id DESC`,
      [studentId]
    );

    res.json({
      success: true,
      leaves: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  applyLeave,
  getStudentLeaves,
};