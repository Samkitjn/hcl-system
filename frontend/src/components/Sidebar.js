import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Room", path: "/dashboard/room" },
    { name: "Mess", path: "/dashboard/mess" },
    { name: "Leave", path: "/dashboard/leave" },
    { name: "Maintenance", path: "/dashboard/maintenance" },
    { name: "Community", path: "/dashboard/community" },
    { name: "Roommate Matching", path: "/dashboard/roommate-matching" },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">HCL System</h2>

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

export default Sidebar;