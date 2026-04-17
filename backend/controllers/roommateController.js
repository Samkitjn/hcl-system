const pool = require("../config/db");

const savePreferences = async (req, res) => {
  try {
    const {
      student_id,
      sleep_schedule,
      study_habit,
      cleanliness_level,
      smoking_preference,
    } = req.body;

    await pool.query(
      `INSERT INTO roommate_preferences (
        student_id,
        sleep_schedule,
        study_habit,
        cleanliness_level,
        smoking_preference
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (student_id)
      DO UPDATE SET
        sleep_schedule = EXCLUDED.sleep_schedule,
        study_habit = EXCLUDED.study_habit,
        cleanliness_level = EXCLUDED.cleanliness_level,
        smoking_preference = EXCLUDED.smoking_preference`,
      [
        student_id,
        sleep_schedule,
        study_habit,
        cleanliness_level,
        smoking_preference,
      ]
    );

    res.json({
      success: true,
      message: "Preferences saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getPotentialMatches = async (req, res) => {
  try {
    const { studentId } = req.params;

    const myPrefResult = await pool.query(
      `SELECT * FROM roommate_preferences WHERE student_id = $1`,
      [studentId]
    );

    if (myPrefResult.rows.length === 0) {
      return res.json({
        success: true,
        matches: [],
      });
    }

    const myPref = myPrefResult.rows[0];

    const result = await pool.query(
      `SELECT rp.*, s.full_name, s.student_id
       FROM roommate_preferences rp
       JOIN students s ON rp.student_id = s.id
       WHERE rp.student_id != $1
       ORDER BY
         (CASE WHEN rp.sleep_schedule = $2 THEN 1 ELSE 0 END +
          CASE WHEN rp.study_habit = $3 THEN 1 ELSE 0 END +
          CASE WHEN rp.cleanliness_level = $4 THEN 1 ELSE 0 END +
          CASE WHEN rp.smoking_preference = $5 THEN 1 ELSE 0 END) DESC`,
      [
        studentId,
        myPref.sleep_schedule,
        myPref.study_habit,
        myPref.cleanliness_level,
        myPref.smoking_preference,
      ]
    );

    res.json({
      success: true,
      matches: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const sendRoommateRequest = async (req, res) => {
  try {
    const { from_student_id, to_student_id } = req.body;

    await pool.query(
      `INSERT INTO roommate_requests (from_student_id, to_student_id)
       VALUES ($1, $2)`,
      [from_student_id, to_student_id]
    );

    res.json({
      success: true,
      message: "Roommate request sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  savePreferences,
  getPotentialMatches,
  sendRoommateRequest,
};