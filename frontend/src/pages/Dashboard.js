import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const stats = [
    {
      title: "Room Status",
      value: "Allocated",
      subtitle: "Block A - Room 101",
    },
    {
      title: "Mess Plan",
      value: "Active",
      subtitle: "Meal plan enabled",
    },
    {
      title: "Leave Requests",
      value: "2",
      subtitle: "1 approved, 1 pending",
    },
    {
      title: "Maintenance",
      value: "1 Open",
      subtitle: "Fan repair request",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <h1 className="dashboard-heading">Dashboard</h1>
          <p className="dashboard-text">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ""}. Here is
            a quick overview of your hostel account.
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
            <h2 className="stat-value">{item.value}</h2>
            <p className="stat-subtitle">{item.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-bottom-grid">
        <div className="panel-card">
          <h3 className="panel-title">Recent Activity</h3>
          <ul className="panel-list">
            <li>Room preference submitted successfully</li>
            <li>Mess subscription updated</li>
            <li>Leave application reviewed</li>
            <li>Maintenance request created</li>
          </ul>
        </div>

        <div className="panel-card">
          <h3 className="panel-title">Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-btn">View Room</button>
            <button className="action-btn">Check Mess</button>
            <button className="action-btn">Apply Leave</button>
            <button className="action-btn">Raise Complaint</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;