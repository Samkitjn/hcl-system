import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const ManagementSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/management/dashboard" },
    { name: "Students", path: "/management/students" },
    { name: "Rooms", path: "/management/rooms" },
    { name: "Room Allocation", path: "/management/room-allocation" },
    { name: "Mess Management", path: "/management/mess" },
    { name: "Leave Management", path: "/management/leave" },
    { name: "Maintenance", path: "/management/maintenance" },
    { name: "Community", path: "/management/community" },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">Management Portal</h2>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default ManagementSidebar;