import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const StudentSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/student/dashboard" },
    { name: "Room", path: "/student/room" },
    { name: "Mess", path: "/student/mess" },
    { name: "Leave", path: "/student/leave" },
    { name: "Maintenance", path: "/student/maintenance" },
    { name: "Community", path: "/student/community" },
    { name: "Roommate Matching", path: "/student/roommate-matching" },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">Student Portal</h2>

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

export default StudentSidebar;