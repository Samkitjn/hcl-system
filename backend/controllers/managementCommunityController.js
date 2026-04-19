const pool = require("../config/db");

const getAllCommunityPosts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cp.id, cp.content, cp.created_at,
              s.full_name, s.student_id
       FROM community_posts cp
       JOIN students s ON cp.student_id = s.id
       ORDER BY cp.id DESC`
    );

    return res.json({
      success: true,
      posts: result.rows,
    });
  } catch (error) {
    console.error("Get all community posts error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteCommunityPost = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM community_posts
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete community post error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCommunityPosts,
  deleteCommunityPost,
};