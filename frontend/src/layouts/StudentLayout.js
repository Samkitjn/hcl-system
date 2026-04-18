import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import Header from "../components/Header";
import "./DashboardLayout.css";

const StudentLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="dashboard-layout student">
      <StudentSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="dashboard-main">
        <Header
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;