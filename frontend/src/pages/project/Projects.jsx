import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useWorkspaceStore from "../../store/workspaceStore";

import {
  createProject,
  deleteProject,
  getProjects,
} from "../../api/projectApi";

export default function Projects() {
  const navigate = useNavigate();

  const { currentOrganization, setCurrentProject } =
    useWorkspaceStore();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  async function loadProjects() {
    if (!currentOrganization?.id) return;

    setLoading(true);

    try {
      const data = await getProjects(currentOrganization.id);
      setProjects(data || []);
    } catch {
      toast.error("Failed to load projects");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, [currentOrganization]);

  async function create(e) {
    e.preventDefault();

    if (!currentOrganization?.id) {
      toast.error("Select an organization first");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      await createProject({
        ...form,
        organizationId: currentOrganization.id,
      });

      toast.success("Project created");

      setForm({
        name: "",
        description: "",
      });

      loadProjects();
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Failed to create project"
      );
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this project?")) return;

    try {
      await deleteProject(id);

      toast.success("Project deleted");

      setProjects((prev) =>
        prev.filter((p) => p.id !== id)
      );
    } catch {
      toast.error("Delete failed");
    }
  }

  if (!currentOrganization) {
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center">
        <h2 className="text-2xl font-semibold">
          No Organization Selected
        </h2>

        <p className="text-gray-500 mt-3">
          Please go to Organizations and open one first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {currentOrganization.name}
        </h1>

        <p className="text-gray-500">Manage Projects</p>
      </div>

      <form
        onSubmit={create}
        className="bg-white rounded-xl shadow p-6 mb-8"
      >
        <input
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Project Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <textarea
          rows={4}
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg">
          Create Project
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow p-6"
            >
              <h2 className="text-xl font-bold">
                {project.name}
              </h2>

              <p className="text-gray-500 mt-3">
                {project.description || "No description"}
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setCurrentProject(project);
                    navigate("/tasks");
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2"
                >
                  Open
                </button>

                <button
                  onClick={() => remove(project.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}