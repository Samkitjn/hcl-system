import React, { useEffect, useState, useCallback } from "react";
import "./RoommateMatching.css";

const RoommateMatching = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role") || "student";

  const [preferences, setPreferences] = useState({
    sleep_schedule: "",
    study_habit: "",
    cleanliness_level: "",
  });

  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [saving, setSaving] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const fetchMatches = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/roommate/matches/${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoadingMatches(false);
    }
  }, [user?.id]);

  const handleSavePreferences = async (e) => {
  e.preventDefault();
  setSaving(true);
  setMessage("");

  const cleaned = {
    sleep_schedule: preferences.sleep_schedule.trim(),
    study_habit: preferences.study_habit.trim(),
    cleanliness_level: preferences.cleanliness_level.trim(),
    smoking_preference: preferences.smoking_preference.trim(),
  };

  if (
    !cleaned.sleep_schedule ||
    !cleaned.study_habit ||
    !cleaned.cleanliness_level ||
    !cleaned.smoking_preference
  ) {
    setMessage("All preference fields are required.");
    setSaving(false);
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/roommate/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: user.id,
          ...cleaned,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setMessage("Preferences saved successfully.");
      fetchMatches();
    } else {
      setMessage(data.message || "Failed to save preferences.");
    }
  } catch (error) {
    setMessage("Server error while saving preferences.");
  } finally {
    setSaving(false);
  }
};

  const handleSendRequest = async (toId) => {
  if (!toId || Number(toId) === Number(user.id)) {
    setMessage("Invalid roommate request.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/roommate/request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_student_id: user.id,
          to_student_id: toId,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setMessage("Roommate request sent successfully.");
    } else {
      setMessage(data.message || "Failed to send roommate request.");
    }
  } catch (error) {
    setMessage("Server error while sending roommate request.");
  }
};

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <div className={`roommate-page ${role}`}>
      <div className="roommate-hero">
        <h1 className="roommate-heading">Roommate Matching</h1>
        <p className="roommate-subtext">
          Set your preferences and find the most compatible roommate.
        </p>
      </div>

      <div className="roommate-grid">
        <div className="roommate-card">
          <h2 className="roommate-card-title">Your Preferences</h2>

          <form onSubmit={handleSavePreferences} className="roommate-form">
            <input
              placeholder="Sleep Schedule"
              value={preferences.sleep_schedule}
              onChange={(e) =>
                setPreferences({ ...preferences, sleep_schedule: e.target.value })
              }
              required
            />

            <input
              placeholder="Study Habit"
              value={preferences.study_habit}
              onChange={(e) =>
                setPreferences({ ...preferences, study_habit: e.target.value })
              }
              required
            />

            <input
              placeholder="Cleanliness Level"
              value={preferences.cleanliness_level}
              onChange={(e) =>
                setPreferences({ ...preferences, cleanliness_level: e.target.value })
              }
              required
            />

            <button className="roommate-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Preferences"}
            </button>

            {message && <p className="roommate-message">{message}</p>}
          </form>
        </div>

        <div className="roommate-card">
          <h2 className="roommate-card-title">Potential Matches</h2>

          {loadingMatches ? (
            <p className="roommate-empty">Loading matches...</p>
          ) : matches.length > 0 ? (
            matches.map((match) => (
              <div key={match.id} className="roommate-match">
                <div>
                  <p className="roommate-name">{match.full_name}</p>
                  <p className="roommate-id">{match.student_id}</p>
                </div>

                <button
                  className="roommate-btn small"
                  onClick={() => handleSendRequest(match.student_id)}
                >
                  Request
                </button>
              </div>
            ))
          ) : (
            <p className="roommate-empty">No matches found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoommateMatching;