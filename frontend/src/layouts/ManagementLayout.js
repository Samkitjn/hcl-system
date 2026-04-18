import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ManagementSidebar from "../components/ManagementSidebar";
import Header from "../components/Header";
import "./DashboardLayout.css";

const ManagementLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="dashboard-layout management">
      <ManagementSidebar
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

export default ManagementLayout;