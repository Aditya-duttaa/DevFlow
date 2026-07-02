import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
import Tasks from "./pages/tasks/Tasks";
import TaskDetails from "./pages/task/TaskDetails";
import Notifications from "./pages/notification/Notifications";
import Activity from "./pages/activity/Activity";
import OrganizationDetails from "./pages/organization/OrganizationDetails";
import RoleGuard from "./routes/RoleGuard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";
import Projects from "./pages/Projects";
import Organizations from "./pages/Organizations";
import { useEffect } from "react";
import useAuthStore from "./store/useAuthStore";

export default function App() {
    useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Layout>
              <Projects />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Layout>
              <Tasks />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/:taskId"
        element={
          <ProtectedRoute>
            <Layout>
              <TaskDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <Layout>
              <Activity />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/organization"
        element={
          <ProtectedRoute>
            <Layout>
              <OrganizationDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}