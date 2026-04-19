const pool = require("../config/db");

const getAllStudentsForAllocation = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.full_name, s.email, s.student_id, s.course, s.year,
              ra.room_id
       FROM students s
       LEFT JOIN room_allocations ra ON s.id = ra.student_id
       WHERE s.status = 'approved'
       ORDER BY s.id ASC`
    );

    return res.json({
      success: true,
      students: result.rows,
    });
  } catch (error) {
    console.error("Get students for allocation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllRoomsForAllocation = async (req, res) => {
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
    console.error("Get rooms for allocation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const allocateRoomToStudent = async (req, res) => {
  const client = await pool.connect();

  try {
    const { student_id, room_id } = req.body;

    if (!student_id || !room_id) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Room ID are required",
      });
    }

    await client.query("BEGIN");

    const existingAllocation = await client.query(
      `SELECT * FROM room_allocations WHERE student_id = $1`,
      [student_id]
    );

    if (existingAllocation.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Student already has a room allocated",
      });
    }

    const roomResult = await client.query(
      `SELECT * FROM rooms WHERE id = $1`,
      [room_id]
    );

    if (roomResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const room = roomResult.rows[0];

    if (room.occupied >= room.capacity) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Room is already full",
      });
    }

    await client.query(
      `INSERT INTO room_allocations (student_id, room_id)
       VALUES ($1, $2)`,
      [student_id, room_id]
    );

    await client.query(
      `UPDATE rooms
       SET occupied = occupied + 1
       WHERE id = $1`,
      [room_id]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Room allocated successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Allocate room error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllStudentsForAllocation,
  getAllRoomsForAllocation,
  allocateRoomToStudent,
};