import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../layout/AuthLayout";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import Dashboard from "../pages/dashboard/Dashboard";
import Organizations from "../pages/organization/Organizations";
import Projects from "../pages/project/Projects";
import Tasks from "../pages/task/Tasks";
import TaskDetails from "../pages/task/TaskDetails";
import Notifications from "../pages/notification/Notifications";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";

function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:taskId" element={<TaskDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;