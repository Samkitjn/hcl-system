import React from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import Header from "../components/Header";
import "./DashboardLayout.css";

const StudentLayout = () => {
  return (
    <div className="dashboard-layout student">
      <StudentSidebar />
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;