const pool = require("../config/db");

const getAllMaintenanceRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT mr.id, mr.issue_type, mr.description, mr.room_number, mr.status, mr.created_at,
              s.full_name, s.student_id, s.course, s.year
       FROM maintenance_requests mr
       JOIN students s ON mr.student_id = s.id
       ORDER BY mr.id DESC`
    );

    return res.json({
      success: true,
      requests: result.rows,
    });
  } catch (error) {
    console.error("Get all maintenance requests error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required",
      });
    }

    const result = await pool.query(
      `UPDATE maintenance_requests
       SET status = $1
       WHERE id = $2
       RETURNING id, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    return res.json({
      success: true,
      message: "Maintenance status updated successfully",
      request: result.rows[0],
    });
  } catch (error) {
    console.error("Update maintenance status error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllMaintenanceRequests,
  updateMaintenanceStatus,
};