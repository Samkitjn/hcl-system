import React from "react";
import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ allowedRole, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    return (
      <Navigate
        to={role === "management" ? "/management/dashboard" : "/student/dashboard"}
        replace
      />
    );
  }

  return children;
};

export default RoleProtectedRoute;