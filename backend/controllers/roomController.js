const pool = require("../config/db");

const getMyRoom = async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await pool.query(
      `SELECT r.room_number, r.block, r.capacity
       FROM room_allocations ra
       JOIN rooms r ON ra.room_id = r.id
       WHERE ra.student_id = $1`,
      [studentId]
    );

    res.json({
      success: true,
      room: result.rows[0] || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM rooms WHERE occupied < capacity`
    );

    res.json({
      success: true,
      rooms: result.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createPreference = async (req, res) => {
  try {
    const { student_id, preferred_block, preferred_capacity } = req.body;

    await pool.query(
      `INSERT INTO room_preferences (student_id, preferred_block, preferred_capacity)
       VALUES ($1, $2, $3)`,
      [student_id, preferred_block, preferred_capacity]
    );

    res.json({
      success: true,
      message: "Preference submitted",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getMyRoom,
  getAvailableRooms,
  createPreference,
};