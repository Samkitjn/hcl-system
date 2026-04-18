import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const ManagementSidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileMenuOpen ? "show" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <h2 className="sidebar-logo">Management Portal</h2>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`sidebar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button className="sidebar-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
};

export default ManagementSidebar;