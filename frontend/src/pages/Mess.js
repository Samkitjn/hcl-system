import React, { useEffect, useState, useCallback } from "react";
import "./Mess.css";

const Mess = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role") || "student";

  const [menu, setMenu] = useState([]);
  const [charges, setCharges] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingCharges, setLoadingCharges] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const fetchMenu = useCallback(async () => {
    try {
      const response = await fetch("https://hcl-system.onrender.com/api/mess/menu");
      const data = await response.json();

      if (data.success) {
        setMenu(data.menu);
      }
    } catch (error) {
      console.error("Error fetching mess menu:", error);
    } finally {
      setLoadingMenu(false);
    }
  }, []);

  const fetchCharges = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/mess/charges/${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setCharges(data.charges);
      }
    } catch (error) {
      console.error("Error fetching mess charges:", error);
    } finally {
      setLoadingCharges(false);
    }
  }, [user?.id]);

  const handleFeedbackSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setMessage("");

  if (!feedbackText.trim()) {
    setMessage("Feedback cannot be empty.");
    setSubmitting(false);
    return;
  }

  const numericRating = Number(rating);

  if (!numericRating || numericRating < 1 || numericRating > 5) {
    setMessage("Please enter a valid rating from 1 to 5.");
    setSubmitting(false);
    return;
  }

  try {
    const response = await fetch("https://hcl-system.onrender.com/api/mess/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: user.id,
        feedback_text: feedbackText.trim(),
        rating: numericRating,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setMessage("Feedback submitted successfully.");
      setFeedbackText("");
      setRating("");
    } else {
      setMessage(data.message || "Failed to submit feedback.");
    }
  } catch (error) {
    setMessage("Server error while submitting feedback.");
  } finally {
    setSubmitting(false);
  }
};

  useEffect(() => {
  if (user?.id) {
    fetchMenu();
    fetchCharges();
  }
}, [fetchMenu, fetchCharges, user?.id]);

  return (
    <div className={`mess-page ${role}`}>
      <div className="mess-hero">
        <div>
          <h1 className="mess-heading">Mess Management</h1>
          <p className="mess-subtext">
            View the weekly menu, check your mess charges, and share your
            feedback about food quality and service.
          </p>
        </div>
      </div>

      <div className="mess-grid">
        <div className="mess-card">
          <h2 className="mess-card-title">My Mess Charges</h2>

          {loadingCharges ? (
            <p className="mess-empty">Loading charges...</p>
          ) : charges.length > 0 ? (
            <div className="mess-charge-list">
              {charges.map((charge) => (
                <div key={charge.id} className="mess-charge-item">
                  <div>
                    <p className="mess-charge-month">{charge.month}</p>
                    <p className="mess-charge-status">{charge.status}</p>
                  </div>
                  <strong className="mess-charge-amount">
                    ₹{charge.amount}
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="mess-empty">No mess charges found.</p>
          )}
        </div>

        <div className="mess-card">
          <h2 className="mess-card-title">Submit Feedback</h2>

          <form className="mess-form" onSubmit={handleFeedbackSubmit}>
            <div className="mess-form-group">
              <label>Feedback</label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write your feedback"
                required
                rows="4"
              />
            </div>

            <div className="mess-form-group">
              <label>Rating</label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Enter rating from 1 to 5"
                required
              />
            </div>

            <button type="submit" className="mess-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>

            {message && <p className="mess-message">{message}</p>}
          </form>
        </div>
      </div>

      <div className="mess-card mess-table-card">
        <div className="mess-table-header">
          <h2 className="mess-card-title">Weekly Mess Menu</h2>
        </div>

        {loadingMenu ? (
          <p className="mess-empty">Loading menu...</p>
        ) : menu.length > 0 ? (
          <div className="mess-table-wrapper">
            <table className="mess-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Meal Type</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {menu.map((item) => (
                  <tr key={item.id}>
                    <td>{item.day}</td>
                    <td>{item.meal_type}</td>
                    <td>{item.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mess-empty">No menu available.</p>
        )}
      </div>
    </div>
  );
};

export default Mess;