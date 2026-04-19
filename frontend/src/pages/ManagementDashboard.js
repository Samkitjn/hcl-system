import React, { useEffect, useState, useCallback } from "react";
import "./ManagementDashboard.css";

const ManagementDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [summary, setSummary] = useState({
    approvedStudents: 0,
    pendingStudents: 0,
    totalRooms: 0,
    availableRooms: 0,
    pendingLeaves: 0,
    openMaintenance: 0,
  });
  const [recentPendingStudents, setRecentPendingStudents] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [recentMaintenance, setRecentMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch(
        "${process.env.REACT_APP_API_URL}/api/management/dashboard/summary"
      );
      const data = await response.json();

      if (data.success) {
        setSummary(data.summary);
        setRecentPendingStudents(data.recentPendingStudents);
        setRecentLeaves(data.recentLeaves);
        setRecentMaintenance(data.recentMaintenance);
      }
    } catch (error) {
      console.error("Error fetching management dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const cards = [
    {
      title: "Approved Students",
      value: summary.approvedStudents,
      subtitle: "Active student accounts",
    },
    {
      title: "Pending Approvals",
      value: summary.pendingStudents,
      subtitle: "Waiting for approval",
    },
    {
      title: "Available Rooms",
      value: summary.availableRooms,
      subtitle: `${summary.totalRooms} total rooms`,
    },
    {
      title: "Pending Leaves",
      value: summary.pendingLeaves,
      subtitle: "Leave requests to review",
    },
    {
      title: "Open Maintenance",
      value: summary.openMaintenance,
      subtitle: "Pending or in progress",
    },
  ];

  return (
    <div className="management-dashboard-page">
      <div className="management-dashboard-hero">
        <div>
          <h1 className="management-dashboard-heading">Management Dashboard</h1>
          <p className="management-dashboard-text">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ""}. Here is
            the current hostel overview and recent activity.
          </p>
        </div>

        <div className="management-dashboard-user-box">
          <p><strong>Name:</strong> {user?.full_name || "N/A"}</p>
          <p><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p><strong>Role:</strong> {user?.role || "management"}</p>
        </div>
      </div>

      <div className="management-stats-grid">
        {cards.map((item, index) => (
          <div className="management-stat-card" key={index}>
            <p className="management-stat-title">{item.title}</p>
            <h2 className="management-stat-value">
              {loading ? "..." : item.value}
            </h2>
            <p className="management-stat-subtitle">
              {loading ? "Loading data..." : item.subtitle}
            </p>
          </div>
        ))}
      </div>

      <div className="management-dashboard-grid">
        <div className="management-panel-card">
          <h3 className="management-panel-title">Recent Pending Approvals</h3>
          {loading ? (
            <p className="management-panel-empty">Loading data...</p>
          ) : recentPendingStudents.length > 0 ? (
            <div className="management-activity-list">
              {recentPendingStudents.map((student) => (
                <div className="management-activity-item" key={student.id}>
                  <div>
                    <p className="management-activity-main">{student.full_name}</p>
                    <p className="management-activity-sub">{student.student_id}</p>
                  </div>
                  <span className="management-badge pending">Pending</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="management-panel-empty">No records found.</p>
          )}
        </div>

        <div className="management-panel-card">
          <h3 className="management-panel-title">Recent Leave Requests</h3>
          {loading ? (
            <p className="management-panel-empty">Loading data...</p>
          ) : recentLeaves.length > 0 ? (
            <div className="management-activity-list">
              {recentLeaves.map((leave) => (
                <div className="management-activity-item" key={leave.id}>
                  <div>
                    <p className="management-activity-main">
                      {leave.full_name} • {leave.leave_type}
                    </p>
                    <p className="management-activity-sub">{leave.student_id}</p>
                  </div>
                  <span className={`management-badge ${leave.status}`}>
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="management-panel-empty">No records found.</p>
          )}
        </div>

        <div className="management-panel-card">
          <h3 className="management-panel-title">Recent Maintenance Requests</h3>
          {loading ? (
            <p className="management-panel-empty">Loading data...</p>
          ) : recentMaintenance.length > 0 ? (
            <div className="management-activity-list">
              {recentMaintenance.map((item) => (
                <div className="management-activity-item" key={item.id}>
                  <div>
                    <p className="management-activity-main">
                      {item.full_name} • {item.issue_type}
                    </p>
                    <p className="management-activity-sub">
                      {item.student_id} • Room {item.room_number}
                    </p>
                  </div>
                  <span className={`management-badge ${item.status}`}>
                    {item.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="management-panel-empty">No records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;