import React, { useEffect, useState, useCallback } from "react";
import "./Leave.css";

const Leave = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role") || "student";

  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/leave/student/${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setLeaves(data.leaves);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoadingLeaves(false);
    }
  }, [user?.id]);

  const handleLeaveSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setMessage("");

  // ✅ Trimmed validation
  if (
    !leaveType.trim() ||
    !fromDate ||
    !toDate ||
    !reason.trim()
  ) {
    setMessage("All fields are required.");
    setSubmitting(false);
    return;
  }

  // ✅ Date validation
  if (new Date(fromDate) > new Date(toDate)) {
    setMessage("From date cannot be after To date.");
    setSubmitting(false);
    return;
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/leave/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: user.id,
        leave_type: leaveType.trim(),
        from_date: fromDate,
        to_date: toDate,
        reason: reason.trim(),
      }),
    });

    const data = await response.json();

    if (data.success) {
      setMessage("Leave request submitted successfully.");
      setLeaveType("");
      setFromDate("");
      setToDate("");
      setReason("");
      fetchLeaves();
    } else {
      setMessage(data.message || "Failed to apply for leave.");
    }
  } catch (error) {
    setMessage("Server error while applying for leave.");
  } finally {
    setSubmitting(false);
  }
};

  useEffect(() => {
    if (user?.id) {
      fetchLeaves();
    }
  }, [fetchLeaves, user?.id]);

  return (
    <div className={`leave-page ${role}`}>
      <div className="leave-hero">
        <div>
          <h1 className="leave-heading">Leave Management</h1>
          <p className="leave-subtext">
            Apply for leave, track your request history, and monitor approval
            status from one place.
          </p>
        </div>
      </div>

      <div className="leave-grid">
        <div className="leave-card">
          <h2 className="leave-card-title">Apply for Leave</h2>

          <form className="leave-form" onSubmit={handleLeaveSubmit}>
            <div className="leave-form-group">
              <label>Leave Type</label>
              <input
                type="text"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                placeholder="Enter leave type"
                required
              />
            </div>

            <div className="leave-form-row">
              <div className="leave-form-group">
                <label>From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  required
                />
              </div>

              <div className="leave-form-group">
                <label>To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="leave-form-group">
              <label>Reason</label>
              <textarea
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for leave"
                required
              />
            </div>

            <button type="submit" className="leave-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Apply Leave"}
            </button>

            {message && <p className="leave-message">{message}</p>}
          </form>
        </div>

        <div className="leave-card">
          <h2 className="leave-card-title">Leave Summary</h2>

          <div className="leave-summary-list">
            <div className="leave-summary-item">
              <span>Total Requests</span>
              <strong>{leaves.length}</strong>
            </div>
            <div className="leave-summary-item">
              <span>Pending</span>
              <strong>
                {leaves.filter((leave) => leave.status === "pending").length}
              </strong>
            </div>
            <div className="leave-summary-item">
              <span>Approved</span>
              <strong>
                {leaves.filter((leave) => leave.status === "approved").length}
              </strong>
            </div>
            <div className="leave-summary-item">
              <span>Rejected</span>
              <strong>
                {leaves.filter((leave) => leave.status === "rejected").length}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="leave-card leave-table-card">
        <div className="leave-table-header">
          <h2 className="leave-card-title">Leave History</h2>
        </div>

        {loadingLeaves ? (
          <p className="leave-empty">Loading data...</p>
        ) : leaves.length > 0 ? (
          <div className="leave-table-wrapper">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.leave_type}</td>
                    <td>{leave.from_date?.split("T")[0]}</td>
                    <td>{leave.to_date?.split("T")[0]}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`leave-status ${leave.status}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="leave-empty">No leave records found.</p>
        )}
      </div>
    </div>
  );
};

export default Leave;