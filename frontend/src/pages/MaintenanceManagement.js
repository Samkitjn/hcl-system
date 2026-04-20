import React, { useEffect, useState, useCallback } from "react";
import "./MaintenanceManagement.css";

const MaintenanceManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/management/maintenance"
      );
      const data = await response.json();

      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/management/maintenance/${id}`,
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
        setMessage("Maintenance status updated successfully.");
        setRequests((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, status } : request
          )
        );
      } else {
        setMessage(data.message || "Failed to update maintenance request.");
      }
    } catch (error) {
      setMessage("Failed to update maintenance request.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="maintenance-management-page">
      <div className="maintenance-management-hero">
        <div>
          <h1 className="maintenance-management-heading">
            Maintenance Management
          </h1>
          <p className="maintenance-management-subtext">
            Review hostel maintenance requests and update their current repair
            status.
          </p>
        </div>
      </div>

      <div className="maintenance-management-card">
        <div className="maintenance-management-card-header">
          <h2 className="maintenance-management-card-title">
            All Maintenance Requests
          </h2>
          <span className="maintenance-management-count">
            {requests.length}
          </span>
        </div>

        {message && (
          <p className="maintenance-management-message">{message}</p>
        )}

        {loading ? (
          <p className="maintenance-management-empty">
            Loading maintenance requests...
          </p>
        ) : requests.length > 0 ? (
          <div className="maintenance-management-table-wrapper">
            <table className="maintenance-management-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Issue Type</th>
                  <th>Room</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.full_name}</td>
                    <td>{request.student_id}</td>
                    <td>{request.issue_type}</td>
                    <td>{request.room_number}</td>
                    <td>{request.description}</td>
                    <td>
                      <span
                        className={`maintenance-status-badge ${request.status}`}
                      >
                        {request.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <select
                        className="maintenance-status-select"
                        value={request.status}
                        onChange={(e) =>
                          handleStatusUpdate(request.id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="maintenance-management-empty">
            No maintenance requests found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MaintenanceManagement;