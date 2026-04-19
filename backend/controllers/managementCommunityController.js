const pool = require("../config/db");

const getAllCommunityPosts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, content, created_at, posted_by_role, posted_by_name, student_id
       FROM community_posts
       ORDER BY id DESC`
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

const createAnnouncement = async (req, res) => {
  try {
    const { management_name, content } = req.body;

    if (!management_name?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Management name and content are required",
      });
    }

    await pool.query(
      `INSERT INTO community_posts
       (student_id, content, posted_by_role, posted_by_name)
       VALUES (NULL, $1, 'management', $2)`,
      [content.trim(), management_name.trim()]
    );

    return res.json({
      success: true,
      message: "Announcement posted successfully",
    });
  } catch (error) {
    console.error("Create announcement error:", error.message);
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
  createAnnouncement,
  deleteCommunityPost,
};