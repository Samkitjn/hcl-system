import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const StudentSidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/student/dashboard" },
    { name: "Room", path: "/student/room" },
    { name: "Mess", path: "/student/mess" },
    { name: "Leave", path: "/student/leave" },
    { name: "Maintenance", path: "/student/maintenance" },
    { name: "Community", path: "/student/community" },
    { name: "Roommate Matching", path: "/student/roommate-matching" },
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
        <h2 className="sidebar-logo">Student Portal</h2>

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

export default StudentSidebar;