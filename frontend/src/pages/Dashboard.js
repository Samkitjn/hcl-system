import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [myRoom, setMyRoom] = useState(null);
  const [charges, setCharges] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const fetchDashboardData = useCallback(async () => {
    try {
      const [roomRes, chargesRes, leavesRes, maintenanceRes] =
        await Promise.all([
          fetch(`https://hcl-system.onrender.com/api/room/my-room/${user.id}`),
          fetch(`https://hcl-system.onrender.com/api/mess/charges/${user.id}`),
          fetch(`https://hcl-system.onrender.com/api/leave/student/${user.id}`),
          fetch(`https://hcl-system.onrender.com/api/maintenance/student/${user.id}`),
        ]);

      const roomData = await roomRes.json();
      const chargesData = await chargesRes.json();
      const leavesData = await leavesRes.json();
      const maintenanceData = await maintenanceRes.json();

      if (roomData.success) setMyRoom(roomData.room);
      if (chargesData.success) setCharges(chargesData.charges);
      if (leavesData.success) setLeaves(leavesData.leaves);
      if (maintenanceData.success) setMaintenanceRequests(maintenanceData.requests);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const latestCharge = charges.length > 0 ? charges[0] : null;
  const openMaintenanceCount = maintenanceRequests.filter(
    (item) => item.status === "pending" || item.status === "in_progress"
  ).length;

  const recentActivity = [
    ...leaves.slice(0, 2).map((leave) => ({
      type: "Leave",
      text: `${leave.leave_type} leave from ${leave.from_date?.split("T")[0]} to ${leave.to_date?.split("T")[0]}`,
      status: leave.status,
      date: leave.created_at,
    })),
    ...maintenanceRequests.slice(0, 2).map((request) => ({
      type: "Maintenance",
      text: `${request.issue_type} issue for room ${request.room_number}`,
      status: request.status,
      date: request.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const stats = [
    {
      title: "Current Room",
      value: myRoom ? myRoom.room_number : "Not Allocated",
      subtitle: myRoom ? `Block ${myRoom.block} • Capacity ${myRoom.capacity}` : "No room assigned yet",
    },
    {
      title: "Latest Mess Charge",
      value: latestCharge ? `₹${latestCharge.amount}` : "No Charges",
      subtitle: latestCharge
        ? `${latestCharge.month} • ${latestCharge.status}`
        : "No charge records found",
    },
    {
      title: "Leave Requests",
      value: String(leaves.length),
      subtitle:
        leaves.length > 0
          ? `${leaves.filter((item) => item.status === "pending").length} pending`
          : "No leave requests yet",
    },
    {
      title: "Open Maintenance",
      value: String(openMaintenanceCount),
      subtitle:
        maintenanceRequests.length > 0
          ? `${maintenanceRequests.length} total requests`
          : "No maintenance requests yet",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <h1 className="dashboard-heading">Student Dashboard</h1>
          <p className="dashboard-text">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ""}. Here is
            your live hostel overview.
          </p>
        </div>

        <div className="dashboard-user-box">
          <p><strong>Student ID:</strong> {user?.student_id || "N/A"}</p>
          <p><strong>Course:</strong> {user?.course || "N/A"}</p>
          <p><strong>Year:</strong> {user?.year || "N/A"}</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <p className="stat-title">{item.title}</p>
            <h2 className="stat-value">{loading ? "..." : item.value}</h2>
            <p className="stat-subtitle">{loading ? "Loading data" : item.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-bottom-grid">
        <div className="panel-card">
          <h3 className="panel-title">Recent Activity</h3>
          {loading ? (
            <p className="panel-empty">Loading activity...</p>
          ) : recentActivity.length > 0 ? (
            <div className="activity-list">
              {recentActivity.map((item, index) => (
                <div className="activity-item" key={index}>
                  <div>
                    <p className="activity-type">{item.type}</p>
                    <p className="activity-text">{item.text}</p>
                  </div>
                  <span className={`activity-status ${item.status}`}>
                    {item.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="panel-empty">No recent activity found.</p>
          )}
        </div>

        <div className="panel-card">
          <h3 className="panel-title">Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-btn" onClick={() => navigate("/student/room")}>
              View Room
            </button>
            <button className="action-btn" onClick={() => navigate("/student/mess")}>
              Check Mess
            </button>
            <button className="action-btn" onClick={() => navigate("/student/leave")}>
              Apply Leave
            </button>
            <button
              className="action-btn"
              onClick={() => navigate("/student/maintenance")}
            >
              Raise Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;