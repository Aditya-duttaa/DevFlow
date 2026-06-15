import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function Tasks() {
  const [organizations, setOrganizations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [organizationId, setOrganizationId] = useState("");
  const [projectId, setProjectId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const getOrganizations = async () => {
    const res = await api.get("/organizations");
    setOrganizations(res.data.data);
  };

  const getProjects = async (orgId) => {
    const res = await api.get(`/projects?organizationId=${orgId}`);
    setProjects(res.data.data);
  };

  const getTasks = async (projId) => {
    const res = await api.get(`/tasks?projectId=${projId}`);
    setTasks(res.data.data);
  };

  const createTask = async (e) => {
    e.preventDefault();

    await api.post("/tasks", {
      title,
      description,
      projectId,
    });

    setTitle("");
    setDescription("");
    getTasks(projectId);
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
    if (organizationId) getProjects(organizationId);
  }, [organizationId]);

  useEffect(() => {
    if (projectId) getTasks(projectId);
  }, [projectId]);

  return (
    <div>
      <Navbar />
      <h1>Tasks</h1>

      <select value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
        <option value="">Select organization</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>{org.name}</option>
        ))}
      </select>

      <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
        <option value="">Select project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>

      <form onSubmit={createTask}>
        <input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button disabled={!projectId}>Create Task</button>
      </form>

      {tasks.map((task) => (
        <div key={task.id}>
          <h3><Link to={`/tasks/${task.id}`}>{task.title}</Link></h3>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Assignee: {task.assigneeId || "None"}</p>
        </div>
      ))}
    </div>
  );
}