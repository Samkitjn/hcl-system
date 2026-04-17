const pool = require("../config/db");

const getMessMenu = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM mess_menu ORDER BY id ASC"
    );

    res.json({
      success: true,
      menu: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const submitMessFeedback = async (req, res) => {
  try {
    const { student_id, feedback_text, rating } = req.body;

    await pool.query(
      `INSERT INTO mess_feedback (student_id, feedback_text, rating)
       VALUES ($1, $2, $3)`,
      [student_id, feedback_text, rating]
    );

    res.json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getMessCharges = async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await pool.query(
      `SELECT * FROM mess_charges
       WHERE student_id = $1
       ORDER BY id DESC`,
      [studentId]
    );

    res.json({
      success: true,
      charges: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getMessMenu,
  submitMessFeedback,
  getMessCharges,
};