import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function Dashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [organizationId, setOrganizationId] = useState("");
  const [dashboard, setDashboard] = useState(null);

  const getOrganizations = async () => {
    const res = await api.get("/organizations");
    setOrganizations(res.data.data || res.data.organizations || []);
    console.log(res.data);
  };

  const getDashboard = async (orgId) => {
  const res = await api.get(`/dashboard/organization/${orgId}`);
  console.log("dashboard", res.data);

  setDashboard(res.data.data);
};

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
    if (organizationId) {
      getDashboard(organizationId);
    }
  }, [organizationId]);

  return (
    <div>
      <Navbar />

      <h1>Dashboard</h1>

      <select
        value={organizationId}
        onChange={(e) => setOrganizationId(e.target.value)}
      >
        <option value="">Select organization</option>
        {Array.isArray(organizations) &&
        organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>

      {dashboard && (
        <div>
          <p>Total Projects: {dashboard.totalProjects}</p>
          <p>Total Tasks: {dashboard.totalTasks}</p>
          <p>TODO: {dashboard.todoTasks}</p>
          <p>IN_PROGRESS: {dashboard.inProgressTasks}</p>
          <p>IN_REVIEW: {dashboard.inReviewTasks}</p>
          <p>DONE: {dashboard.doneTasks}</p>
          <p>Total Members: {dashboard.totalMembers}</p>
        </div>
      )}
    </div>
  );
}