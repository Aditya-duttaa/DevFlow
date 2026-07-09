import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
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
  const queryClient = useQueryClient();
  const {
    currentOrganization,
    currentMember,
    setCurrentProject,
  } = useWorkspaceStore();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const projectsKey = ["projects", currentOrganization?.id];

  const projectsQuery = useQuery({
    queryKey: projectsKey,
    queryFn: () => getProjects(currentOrganization.id),
    enabled: !!currentOrganization?.id,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: projectsKey });
      const previous = queryClient.getQueryData(projectsKey) ?? [];
      const optimisticId = `temp-${Date.now()}`;
      const optimisticProject = {
        id: optimisticId,
        name: data.name,
        description: data.description,
        isOptimistic: true,
      };

      queryClient.setQueryData(projectsKey, [
        optimisticProject,
        ...previous,
      ]);

      return { previous, optimisticId };
    },
    onError: (e, data, context) => {
      queryClient.setQueryData(projectsKey, context?.previous ?? []);
      toast.error(
        e.response?.data?.message || "Failed to create project"
      );
    },
    onSuccess: (createdProject, data, context) => {
      queryClient.setQueryData(projectsKey, (current = []) =>
        current.map((project) =>
          project.id === context?.optimisticId
            ? createdProject
            : project
        )
      );
      setForm({ name: "", description: "" });
      toast.success("Project created");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectsKey });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", currentOrganization?.id],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: projectsKey });
      const previous = queryClient.getQueryData(projectsKey) ?? [];

      queryClient.setQueryData(projectsKey, (current = []) =>
        current.filter((project) => project.id !== id)
      );

      return { previous };
    },
    onError: (e, id, context) => {
      queryClient.setQueryData(projectsKey, context?.previous ?? []);
      toast.error("Delete failed");
    },
    onSuccess: () => {
      toast.success("Project deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectsKey });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", currentOrganization?.id],
      });
    },
  });

  function create(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    createMutation.mutate({
      ...form,
      organizationId: currentOrganization.id,
    });
  }

  function remove(id) {
    if (!window.confirm("Delete this project?")) return;
    deleteMutation.mutate(id);
  }

  if (!currentOrganization) {
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center">
        <h2 className="text-2xl font-semibold">
          No Organization Selected
        </h2>
        <p className="text-gray-500 mt-3">
          Please open an organization first.
        </p>
      </div>
    );
  }

  const projects = projectsQuery.data ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {currentOrganization.name}
        </h1>
        <p className="text-gray-500">Manage Projects</p>
      </div>

      {(currentMember?.role === "OWNER" ||
        currentMember?.role === "ADMIN" ||
        currentMember?.role === "MANAGER") && (
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
              setForm({ ...form, description: e.target.value })
            }
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg">
            Create Project
          </button>
        </form>
      )}

      {projectsQuery.isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow p-6"
            >
              <h2 className="text-xl font-bold">{project.name}</h2>
              <p className="text-gray-500 mt-3">
                {project.description || "No description"}
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    if (project.isOptimistic) return;
                    setCurrentProject(project);
                    navigate("/tasks");
                  }}
                  disabled={project.isOptimistic}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg py-2"
                >
                  {project.isOptimistic ? "Saving..." : "Open"}
                </button>
                {(currentMember?.role === "OWNER" ||
                  currentMember?.role === "ADMIN") && (
                  <button
                    onClick={() => remove(project.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
