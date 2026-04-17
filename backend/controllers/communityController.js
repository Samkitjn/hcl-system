const pool = require("../config/db");

const createPost = async (req, res) => {
  try {
    const { student_id, content } = req.body;

    if (!student_id || !content) {
      return res.status(400).json({
        success: false,
        message: "Student ID and content are required",
      });
    }

    await pool.query(
      `INSERT INTO community_posts (student_id, content)
       VALUES ($1, $2)`,
      [student_id, content]
    );

    res.json({
      success: true,
      message: "Post created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cp.id, cp.content, cp.created_at, s.full_name, s.student_id
       FROM community_posts cp
       JOIN students s ON cp.student_id = s.id
       ORDER BY cp.id DESC`
    );

    res.json({
      success: true,
      posts: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
};