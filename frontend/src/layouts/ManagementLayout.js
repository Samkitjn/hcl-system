import React from "react";
import { Outlet } from "react-router-dom";
import ManagementSidebar from "../components/ManagementSidebar";
import Header from "../components/Header";
import "./DashboardLayout.css";

const ManagementLayout = () => {
  return (
    <div className="dashboard-layout management">
      <ManagementSidebar />
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagementLayout;