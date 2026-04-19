const pool = require("../config/db");

const createPost = async (req, res) => {
  try {
    const { student_id, content } = req.body;

    if (!student_id || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Student ID and content are required",
      });
    }

    const studentResult = await pool.query(
      `SELECT full_name FROM students WHERE id = $1`,
      [student_id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const student = studentResult.rows[0];

    await pool.query(
      `INSERT INTO community_posts
       (student_id, content, posted_by_role, posted_by_name)
       VALUES ($1, $2, 'student', $3)`,
      [student_id, content.trim(), student.full_name]
    );

    return res.json({
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
      `SELECT id, content, created_at, posted_by_role, posted_by_name, student_id
       FROM community_posts
       ORDER BY id DESC`
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