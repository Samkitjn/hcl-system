const pool = require("../config/db");

const getAllRooms = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, room_number, block, capacity, occupied
       FROM rooms
       ORDER BY room_number ASC`
    );

    return res.json({
      success: true,
      rooms: result.rows,
    });
  } catch (error) {
    console.error("Get all rooms error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { getAllRooms };