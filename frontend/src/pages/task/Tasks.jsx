import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useWorkspaceStore from "../../store/workspaceStore";
import MemberPicker from "../../components/member/MemberPicker";
import { getOrganization } from "../../api/organizationApi";
import {
  createTask,
  getTasks,
  deleteTask,
  changeTaskStatus,
} from "../../api/taskApi";

const columns = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
];

export default function Tasks() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    currentOrganization,
    currentProject,
    currentMember,
    setCurrentOrganizationDetails,
    setCurrentMember,
  } = useWorkspaceStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    assigneeId: "",
  });

  const tasksKey = ["tasks", currentProject?.id];

  const organizationQuery = useQuery({
    queryKey: ["organization", currentOrganization?.id],
    queryFn: () => getOrganization(currentOrganization.id),
    enabled: !!currentOrganization?.id,
  });

  useEffect(() => {
    if (organizationQuery.data) {
      setCurrentOrganizationDetails(organizationQuery.data);

      const refreshedMember =
        organizationQuery.data.members.find(
          (member) => member.id === currentMember?.id
        ) || currentMember;

      if (refreshedMember) setCurrentMember(refreshedMember);
    }
  }, [
    currentMember,
    currentMember?.id,
    organizationQuery.data,
    setCurrentMember,
    setCurrentOrganizationDetails,
  ]);

  const members =
    organizationQuery.data?.members ??
    currentOrganization?.members ??
    [];

  const tasksQuery = useQuery({
    queryKey: tasksKey,
    queryFn: () => getTasks(currentProject.id),
    enabled: !!currentProject?.id,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: tasksKey });
      const previous = queryClient.getQueryData(tasksKey) ?? [];
      const assignee = members.find(
        (member) => member.id === data.assigneeId
      );
      const optimisticTask = {
        id: `temp-${Date.now()}`,
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        status: "TODO",
        assigneeId: data.assigneeId,
        assignee,
      };

      queryClient.setQueryData(tasksKey, [
        optimisticTask,
        ...previous,
      ]);

      return { previous };
    },
    onError: (e, data, context) => {
      queryClient.setQueryData(tasksKey, context?.previous ?? []);
      toast.error(
        e.response?.data?.message || "Failed to create task"
      );
    },
    onSuccess: () => {
      setForm({ title: "", description: "", assigneeId: "" });
      toast.success("Task Created");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", currentOrganization?.id],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: tasksKey });
      const previous = queryClient.getQueryData(tasksKey) ?? [];

      queryClient.setQueryData(tasksKey, (current = []) =>
        current.filter((task) => task.id !== id)
      );

      return { previous };
    },
    onError: (e, id, context) => {
      queryClient.setQueryData(tasksKey, context?.previous ?? []);
      toast.error("Delete failed");
    },
    onSuccess: () => toast.success("Deleted"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", currentOrganization?.id],
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => changeTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: tasksKey });
      const previous = queryClient.getQueryData(tasksKey) ?? [];

      queryClient.setQueryData(tasksKey, (current = []) =>
        current.map((task) =>
          task.id === id ? { ...task, status } : task
        )
      );

      return { previous };
    },
    onError: (e, data, context) => {
      queryClient.setQueryData(tasksKey, context?.previous ?? []);
      toast.error("Failed to update status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey });
    },
  });

  function create(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    createMutation.mutate({
      ...form,
      projectId: currentProject.id,
      assigneeId: form.assigneeId || undefined,
    });
  }

  function remove(id) {
    if (!window.confirm("Delete Task?")) return;
    deleteMutation.mutate(id);
  }

  function nextStatus(task) {
    const index = columns.indexOf(task.status);
    if (index === columns.length - 1) return;

    statusMutation.mutate({
      id: task.id,
      status: columns[index + 1],
    });
  }

  if (!currentProject) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        Select a Project First
      </div>
    );
  }

  const tasks = tasksQuery.data ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {currentProject.name}
      </h1>

      {(currentMember?.role === "OWNER" ||
        currentMember?.role === "ADMIN" ||
        currentMember?.role === "MANAGER") && (
        <form
          onSubmit={create}
          className="bg-white rounded-xl shadow p-6 mb-8"
        >
          <input
            placeholder="Task Title"
            className="border p-3 rounded-lg w-full mb-4"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            rows={4}
            className="border p-3 rounded-lg w-full mb-4"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <MemberPicker
            members={members}
            selectedMemberId={form.assigneeId}
            onSelect={(assigneeId) =>
              setForm({ ...form, assigneeId })
            }
          />
          <button className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg">
            Create Task
          </button>
        </form>
      )}

      {tasksQuery.isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {columns.map((status) => (
            <div
              key={status}
              className="bg-slate-100 rounded-xl p-4"
            >
              <h2 className="font-bold mb-4">
                {status.replaceAll("_", " ")}
              </h2>
              <div className="space-y-4">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg shadow p-4"
                    >
                      <h3 className="font-semibold">
                        {task.title}
                      </h3>
                      <p className="text-gray-500 mt-2 text-sm">
                        {task.description || "No description"}
                      </p>
                      <p className="text-sm mt-3">
                        <span className="text-gray-500">
                          Assigned to:
                        </span>{" "}
                        <span className="font-medium">
                          {task.assignee?.user?.name ||
                            "Unassigned"}
                        </span>
                      </p>
                      <div className="flex gap-2 mt-5">
                        <button
                          onClick={() =>
                            navigate(`/tasks/${task.id}`)
                          }
                          className="flex-1 bg-indigo-600 text-white rounded py-2"
                        >
                          Open
                        </button>
                        {status !== "DONE" && (
                          <button
                            onClick={() => nextStatus(task)}
                            className="bg-green-600 text-white px-3 rounded"
                          >
                            →
                          </button>
                        )}
                        {(currentMember?.role === "OWNER" ||
                          currentMember?.role === "ADMIN") && (
                          <button
                            onClick={() => remove(task.id)}
                            className="bg-red-500 text-white px-3 rounded"
                          >
                            X
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
