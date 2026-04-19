const pool = require("../config/db");

const getManagementDashboardSummary = async (req, res) => {
  try {
    const [
      approvedStudentsResult,
      pendingStudentsResult,
      totalRoomsResult,
      availableRoomsResult,
      pendingLeavesResult,
      openMaintenanceResult,
      recentPendingStudentsResult,
      recentLeaveResult,
      recentMaintenanceResult,
    ] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS count FROM students WHERE status = 'approved'`),
      pool.query(`SELECT COUNT(*)::int AS count FROM students WHERE status = 'pending'`),
      pool.query(`SELECT COUNT(*)::int AS count FROM rooms`),
      pool.query(`SELECT COUNT(*)::int AS count FROM rooms WHERE occupied < capacity`),
      pool.query(`SELECT COUNT(*)::int AS count FROM leave_requests WHERE status = 'pending'`),
      pool.query(
        `SELECT COUNT(*)::int AS count
         FROM maintenance_requests
         WHERE status = 'pending' OR status = 'in_progress'`
      ),
      pool.query(
        `SELECT id, full_name, student_id, created_at
         FROM students
         WHERE status = 'pending'
         ORDER BY id DESC
         LIMIT 5`
      ),
      pool.query(
        `SELECT lr.id, lr.leave_type, lr.status, lr.created_at, s.full_name, s.student_id
         FROM leave_requests lr
         JOIN students s ON lr.student_id = s.id
         ORDER BY lr.id DESC
         LIMIT 5`
      ),
      pool.query(
        `SELECT mr.id, mr.issue_type, mr.status, mr.room_number, mr.created_at, s.full_name, s.student_id
         FROM maintenance_requests mr
         JOIN students s ON mr.student_id = s.id
         ORDER BY mr.id DESC
         LIMIT 5`
      ),
    ]);

    return res.json({
      success: true,
      summary: {
        approvedStudents: approvedStudentsResult.rows[0].count,
        pendingStudents: pendingStudentsResult.rows[0].count,
        totalRooms: totalRoomsResult.rows[0].count,
        availableRooms: availableRoomsResult.rows[0].count,
        pendingLeaves: pendingLeavesResult.rows[0].count,
        openMaintenance: openMaintenanceResult.rows[0].count,
      },
      recentPendingStudents: recentPendingStudentsResult.rows,
      recentLeaves: recentLeaveResult.rows,
      recentMaintenance: recentMaintenanceResult.rows,
    });
  } catch (error) {
    console.error("Management dashboard summary error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { getManagementDashboardSummary };