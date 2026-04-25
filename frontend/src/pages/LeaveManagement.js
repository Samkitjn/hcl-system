import React, { useEffect, useState, useCallback } from "react";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const fetchLeaves = useCallback(async () => {
    try {
      const response = await fetch("https://hcl-system.onrender.com/api/management/leave");
      const data = await response.json();

      if (data.success) {
        setLeaves(data.leaves);
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/management/leave/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage(`Leave request ${status} successfully.`);
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.id === id ? { ...leave, status } : leave
          )
        );
      } else {
        setMessage(data.message || "Failed to update leave request.");
      }
    } catch (error) {
      setMessage("Failed to update leave request.");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  return (
    <div className="leave-management-page">
      <div className="leave-management-hero">
        <div>
          <h1 className="leave-management-heading">Leave Management</h1>
          <p className="leave-management-subtext">
            Review student leave requests and approve or reject them from one place.
          </p>
        </div>
      </div>

      <div className="leave-management-card">
        <div className="leave-management-card-header">
          <h2 className="leave-management-card-title">All Leave Requests</h2>
          <span className="leave-management-count">{leaves.length}</span>
        </div>

        {message && <p className="leave-management-message">{message}</p>}

        {loading ? (
          <p className="leave-management-empty">Loading leave requests...</p>
        ) : leaves.length > 0 ? (
          <div className="leave-management-table-wrapper">
            <table className="leave-management-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.full_name}</td>
                    <td>{leave.student_id}</td>
                    <td>{leave.leave_type}</td>
                    <td>{leave.from_date?.split("T")[0]}</td>
                    <td>{leave.to_date?.split("T")[0]}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`leave-status-badge ${leave.status}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.status === "pending" ? (
                        <div className="leave-action-group">
                          <button
                            className="leave-approve-btn"
                            onClick={() => handleStatusUpdate(leave.id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="leave-reject-btn"
                            onClick={() => handleStatusUpdate(leave.id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="leave-action-done">Updated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="leave-management-empty">No leave requests found.</p>
        )}
      </div>
    </div>
  );
};

export default LeaveManagement;