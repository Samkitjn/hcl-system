import React from "react";
import "./Dashboard.css";

const ManagementDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const stats = [
    {
      title: "Total Students",
      value: "128",
      subtitle: "Registered students",
    },
    {
      title: "Available Rooms",
      value: "24",
      subtitle: "Ready for allocation",
    },
    {
      title: "Pending Leaves",
      value: "6",
      subtitle: "Waiting for approval",
    },
    {
      title: "Open Complaints",
      value: "3",
      subtitle: "Need attention",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <h1 className="dashboard-heading">Management Dashboard</h1>
          <p className="dashboard-text">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ""}. Monitor
            students, rooms, leave requests, and hostel operations from one place.
          </p>
        </div>

        <div className="dashboard-user-box">
          <p><strong>Name:</strong> {user?.full_name || "N/A"}</p>
          <p><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p><strong>Role:</strong> {user?.role || "management"}</p>
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
    </div>
  );
};

export default ManagementDashboard;