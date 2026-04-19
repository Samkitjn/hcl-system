import React, { useEffect, useState, useCallback } from "react";
import "./Maintenance.css";

const Maintenance = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role") || "student";

  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/maintenance/student/${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  }, [user?.id]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setMessage("");

  if (!issueType.trim() || !roomNumber.trim() || !description.trim()) {
    setMessage("All fields are required.");
    setSubmitting(false);
    return;
  }

  try {
    const response = await fetch("${process.env.REACT_APP_API_URL}/api/maintenance/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: user.id,
        issue_type: issueType.trim(),
        description: description.trim(),
        room_number: roomNumber.trim(),
      }),
    });

    const data = await response.json();

    if (data.success) {
      setMessage("Maintenance request submitted successfully.");
      setIssueType("");
      setDescription("");
      setRoomNumber("");
      fetchRequests();
    } else {
      setMessage(data.message || "Failed to submit maintenance request.");
    }
  } catch (error) {
    setMessage("Server error while submitting maintenance request.");
  } finally {
    setSubmitting(false);
  }
};

  useEffect(() => {
    if (user?.id) {
      fetchRequests();
    }
  }, [fetchRequests, user?.id]);

  return (
    <div className={`maintenance-page ${role}`}>
      <div className="maintenance-hero">
        <div>
          <h1 className="maintenance-heading">Maintenance Management</h1>
          <p className="maintenance-subtext">
            Raise hostel maintenance requests, track issue history, and monitor
            the progress of repairs.
          </p>
        </div>
      </div>

      <div className="maintenance-grid">
        <div className="maintenance-card">
          <h2 className="maintenance-card-title">Raise a Request</h2>

          <form className="maintenance-form" onSubmit={handleSubmit}>
            <div className="maintenance-form-group">
              <label>Issue Type</label>
              <input
                type="text"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                placeholder="Enter issue type"
                required
              />
            </div>

            <div className="maintenance-form-group">
              <label>Room Number</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Enter room number"
                required
              />
            </div>

            <div className="maintenance-form-group">
              <label>Description</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem"
                required
              />
            </div>

            <button
              type="submit"
              className="maintenance-btn"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>

            {message && <p className="maintenance-message">{message}</p>}
          </form>
        </div>

        <div className="maintenance-card">
          <h2 className="maintenance-card-title">Request Summary</h2>

          <div className="maintenance-summary-list">
            <div className="maintenance-summary-item">
              <span>Total Requests</span>
              <strong>{requests.length}</strong>
            </div>
            <div className="maintenance-summary-item">
              <span>Pending</span>
              <strong>
                {requests.filter((request) => request.status === "pending").length}
              </strong>
            </div>
            <div className="maintenance-summary-item">
              <span>In Progress</span>
              <strong>
                {
                  requests.filter((request) => request.status === "in_progress")
                    .length
                }
              </strong>
            </div>
            <div className="maintenance-summary-item">
              <span>Resolved</span>
              <strong>
                {requests.filter((request) => request.status === "resolved").length}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="maintenance-card maintenance-table-card">
        <div className="maintenance-table-header">
          <h2 className="maintenance-card-title">Request History</h2>
        </div>

        {loadingRequests ? (
          <p className="maintenance-empty">Loading request history...</p>
        ) : requests.length > 0 ? (
          <div className="maintenance-table-wrapper">
            <table className="maintenance-table">
              <thead>
                <tr>
                  <th>Issue Type</th>
                  <th>Room</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.issue_type}</td>
                    <td>{request.room_number}</td>
                    <td>{request.description}</td>
                    <td>
                      <span className={`maintenance-status ${request.status}`}>
                        {request.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>{request.created_at?.split("T")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="maintenance-empty">No maintenance requests found.</p>
        )}
      </div>
    </div>
  );
};

export default Maintenance;