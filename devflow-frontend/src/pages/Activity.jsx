import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function Activity() {
  const [organizations, setOrganizations] = useState([]);
  const [organizationId, setOrganizationId] = useState("");
  const [activities, setActivities] = useState([]);

  const getOrganizations = async () => {
    const res = await api.get("/organizations");
    setOrganizations(res.data.data);
  };

  const getActivities = async (orgId) => {
    const res = await api.get(`/activities/organization/${orgId}`);
    setActivities(res.data.data);
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
    if (organizationId) getActivities(organizationId);
  }, [organizationId]);

  return (
    <div>
      <Navbar />
      <h1>Activity</h1>

      <select value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
        <option value="">Select organization</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>{org.name}</option>
        ))}
      </select>

      {activities.map((activity) => (
        <div key={activity.id}>
          <p>{activity.action}</p>
          <p>{activity.message}</p>
          <p>{new Date(activity.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}