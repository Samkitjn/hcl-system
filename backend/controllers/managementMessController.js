const pool = require("../config/db");

const getMessManagementData = async (req, res) => {
  try {
    const [menuResult, chargesResult, studentsResult] = await Promise.all([
      pool.query(
        `SELECT id, day, meal_type, items
         FROM mess_menu
         ORDER BY id ASC`
      ),
      pool.query(
        `SELECT mc.id, mc.amount, mc.month, mc.status,
                s.full_name, s.student_id
         FROM mess_charges mc
         JOIN students s ON mc.student_id = s.id
         ORDER BY mc.id DESC`
      ),
      pool.query(
        `SELECT id, full_name, student_id
         FROM students
         WHERE status = 'approved'
         ORDER BY full_name ASC`
      ),
    ]);

    return res.json({
      success: true,
      menu: menuResult.rows,
      charges: chargesResult.rows,
      students: studentsResult.rows,
    });
  } catch (error) {
    console.error("Get mess management data error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const addMessCharge = async (req, res) => {
  try {
    const { student_id, amount, month, status } = req.body;

    if (!student_id || !amount || !month?.trim() || !status?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await pool.query(
      `INSERT INTO mess_charges (student_id, amount, month, status)
       VALUES ($1, $2, $3, $4)`,
      [student_id, amount, month.trim(), status.trim()]
    );

    return res.json({
      success: true,
      message: "Mess charge added successfully.",
    });
  } catch (error) {
    console.error("Add mess charge error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getMessManagementData,
  addMessCharge,
};