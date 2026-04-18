const pool = require("../config/db");

const getPendingStudents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, student_id, course, year, status, is_preloaded, created_at
       FROM students
       WHERE status = 'pending'
       ORDER BY id DESC`
    );

    return res.json({
      success: true,
      students: result.rows,
    });
  } catch (error) {
    console.error("Get pending students error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const approveStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE students
       SET status = 'approved'
       WHERE id = $1
       RETURNING id, full_name, email, student_id, status`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.json({
      success: true,
      message: "Student approved successfully",
      student: result.rows[0],
    });
  } catch (error) {
    console.error("Approve student error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getPendingStudents,
  approveStudent,
};