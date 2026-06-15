import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function Projects() {
  const [organizations, setOrganizations] = useState([]);
  const [organizationId, setOrganizationId] = useState("");
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");

  const getOrganizations = async () => {
    const res = await api.get("/organizations");
    setOrganizations(res.data.data);
  };

  const getProjects = async (orgId) => {
    const res = await api.get(`/projects?organizationId=${orgId}`);
    setProjects(res.data.data);
  };

  const createProject = async (e) => {
    e.preventDefault();
    await api.post("/projects", { name, organizationId });
    setName("");
    getProjects(organizationId);
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
    if (organizationId) getProjects(organizationId);
  }, [organizationId]);

  return (
    <div>
      <Navbar />
      <h1>Projects</h1>

      <select value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
        <option value="">Select organization</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>{org.name}</option>
        ))}
      </select>

      <form onSubmit={createProject}>
        <input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
        <button disabled={!organizationId}>Create Project</button>
      </form>

      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.id}</p>
        </div>
      ))}
    </div>
  );
}