const pool = require("../config/db");

const getAllLeaveRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT lr.id, lr.leave_type, lr.from_date, lr.to_date, lr.reason, lr.status, lr.created_at,
              s.full_name, s.student_id, s.course, s.year
       FROM leave_requests lr
       JOIN students s ON lr.student_id = s.id
       ORDER BY lr.id DESC`
    );

    return res.json({
      success: true,
      leaves: result.rows,
    });
  } catch (error) {
    console.error("Get all leave requests error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required",
      });
    }

    const result = await pool.query(
      `UPDATE leave_requests
       SET status = $1
       WHERE id = $2
       RETURNING id, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    return res.json({
      success: true,
      message: `Leave request ${status} successfully`,
      leave: result.rows[0],
    });
  } catch (error) {
    console.error("Update leave status error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllLeaveRequests,
  updateLeaveStatus,
};