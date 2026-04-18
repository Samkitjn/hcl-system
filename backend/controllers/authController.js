const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerStudent = async (req, res) => {
  try {
    const { full_name, email, password, student_id, course, year } = req.body;

    if (
      !full_name?.trim() ||
      !email?.trim() ||
      !password?.trim() ||
      !student_id?.trim() ||
      !course?.trim() ||
      !year
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const trimmedEmail = email.trim();
    const trimmedStudentId = student_id.trim();
    const trimmedName = full_name.trim();
    const trimmedCourse = course.trim();
    const trimmedPassword = password.trim();

    const existingStudentResult = await pool.query(
      `SELECT * FROM students
       WHERE email = $1 OR student_id = $2`,
      [trimmedEmail, trimmedStudentId]
    );

    if (existingStudentResult.rows.length > 0) {
      const existingStudent = existingStudentResult.rows[0];

      // First-year preloaded student activates account
      if (existingStudent.is_preloaded === true) {
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

        await pool.query(
          `UPDATE students
           SET full_name = $1,
               email = $2,
               password = $3,
               student_id = $4,
               course = $5,
               year = $6,
               status = 'approved'
           WHERE id = $7`,
          [
            trimmedName,
            trimmedEmail,
            hashedPassword,
            trimmedStudentId,
            trimmedCourse,
            Number(year),
            existingStudent.id,
          ]
        );

        return res.json({
          success: true,
          message: "Account activated successfully. You can now log in.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Email or Student ID already registered",
      });
    }

    // Normal self-registration for non-preloaded students
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    await pool.query(
      `INSERT INTO students
       (full_name, email, password, student_id, course, year, status, is_preloaded)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', FALSE)`,
      [
        trimmedName,
        trimmedEmail,
        hashedPassword,
        trimmedStudentId,
        trimmedCourse,
        Number(year),
      ]
    );

    return res.json({
      success: true,
      message: "Registration successful. Wait for approval before login.",
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      "SELECT * FROM students WHERE email = $1",
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const student = result.rows[0];

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (student.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "You are not approved to login yet.",
      });
    }

    const token = jwt.sign(
      {
        id: student.id,
        email: student.email,
        role: "student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        student_id: student.student_id,
        course: student.course,
        year: student.year,
        role: "student",
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { registerStudent, loginStudent };