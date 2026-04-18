import React from "react";
import "./Header.css";

const Header = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role") || "student";

  return (
    <div className="header">
      <div className="header-left">
        <button
          type="button"
          className="menu-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div>
          <h2 className="header-title">
            {role === "management" ? "Management Portal" : "Student Portal"}
          </h2>
          <p className="header-subtitle">
            {user
              ? `${user.full_name}${user.student_id ? ` (${user.student_id})` : ""}`
              : "User"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;