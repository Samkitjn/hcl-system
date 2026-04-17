import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Room from "./pages/Room";
import Mess from "./pages/Mess";
import Leave from "./pages/Leave";
import Maintenance from "./pages/Maintenance";
import Community from "./pages/Community";
import RoommateMatching from "./pages/RoommateMatching";

import ManagementDashboard from "./pages/ManagementDashboard";
import Students from "./pages/Students";
import RoomsManagement from "./pages/RoomsManagement";
import RoomAllocation from "./pages/RoomAllocation";
import MessManagement from "./pages/MessManagement";
import LeaveManagement from "./pages/LeaveManagement";
import MaintenanceManagement from "./pages/MaintenanceManagement";
import CommunityManagement from "./pages/CommunityManagement";

import StudentLayout from "./layouts/StudentLayout";
import ManagementLayout from "./layouts/ManagementLayout";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/student"
          element={
            <RoleProtectedRoute allowedRole="student">
              <StudentLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="room" element={<Room />} />
          <Route path="mess" element={<Mess />} />
          <Route path="leave" element={<Leave />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="community" element={<Community />} />
          <Route path="roommate-matching" element={<RoommateMatching />} />
        </Route>

        <Route
          path="/management"
          element={
            <RoleProtectedRoute allowedRole="management">
              <ManagementLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ManagementDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="rooms" element={<RoomsManagement />} />
          <Route path="room-allocation" element={<RoomAllocation />} />
          <Route path="mess" element={<MessManagement />} />
          <Route path="leave" element={<LeaveManagement />} />
          <Route path="maintenance" element={<MaintenanceManagement />} />
          <Route path="community" element={<CommunityManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;