import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import useAuthStore from "./store/authStore";
import useWorkspaceStore from "./store/workspaceStore";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleGuard from "./routes/RoleGuard";

import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Dashboard from "./pages/dashboard/Dashboard";
import Organizations from "./pages/organization/Organizations";
import Projects from "./pages/project/Projects";
import Tasks from "./pages/task/Tasks";
import TaskDetails from "./pages/task/TaskDetails";
import Notifications from "./pages/notification/Notifications";
import Activity from "./pages/activity/Activity";
import OrganizationDetails from "./pages/organization/OrganizationDetails";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";

/* 🔥 NEW: Org Guard */
function OrgGuard({ children }) {
  const currentOrganization = useWorkspaceStore(
    (state) => state.currentOrganization
  );

  if (!currentOrganization) {
    return <Navigate to="/organizations" replace />;
  }

  return children;
}

export default function App() {
  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  return (
    <Routes>
      {/* Public */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/organizations" element={<Organizations />} />

        <Route
          path="/"
          element={
            <OrgGuard>
              <Dashboard />
            </OrgGuard>
          }
        />

        <Route
          path="/projects"
          element={
            <OrgGuard>
              <Projects />
            </OrgGuard>
          }
        />

        <Route
          path="/tasks"
          element={
            <OrgGuard>
              <Tasks />
            </OrgGuard>
          }
        />

        <Route
          path="/tasks/:taskId"
          element={
            <OrgGuard>
              <TaskDetails />
            </OrgGuard>
          }
        />

        <Route
          path="/notifications"
          element={
            <OrgGuard>
              <Notifications />
            </OrgGuard>
          }
        />

        <Route
          path="/activity"
          element={
            <OrgGuard>
              <Activity />
            </OrgGuard>
          }
        />

        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        <Route
          path="/organization"
          element={
            <RoleGuard>
              <OrganizationDetails />
            </RoleGuard>
          }
        />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
