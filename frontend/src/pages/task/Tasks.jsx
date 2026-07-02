import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useWorkspaceStore from "../../store/workspaceStore";

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

  const { currentProject } =
    useWorkspaceStore();

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  async function loadTasks() {
    if (!currentProject) return;

    setLoading(true);

    try {
      const data = await getTasks(
        currentProject.id
      );

      setTasks(data);
    } catch {
      toast.error(
        "Failed to load tasks"
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, [currentProject]);

  async function create(e) {
    e.preventDefault();

    try {
      await createTask({
        ...form,
        projectId: currentProject.id,
      });

      toast.success("Task Created");

      setForm({
        title: "",
        description: "",
      });

      loadTasks();
    } catch (e) {
      toast.error(
        e.response?.data?.message
      );
    }
  }

  async function remove(id) {
    if (
      !window.confirm(
        "Delete Task?"
      )
    )
      return;

    await deleteTask(id);

    toast.success("Deleted");

    loadTasks();
  }

  async function nextStatus(task) {
    const order = [
      "TODO",
      "IN_PROGRESS",
      "IN_REVIEW",
      "DONE",
    ];

    let index = order.indexOf(
      task.status
    );

    if (index === 3) return;

    await changeTaskStatus(
      task.id,
      order[index + 1]
    );

    loadTasks();
  }

  if (!currentProject)
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        Select a Project First
      </div>
    );

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        {currentProject.name}
      </h1>

      <form
        onSubmit={create}
        className="bg-white rounded-xl shadow p-6 mb-8"
      >

        <input
          placeholder="Task Title"
          className="border p-3 rounded-lg w-full mb-4"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title:
                e.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          rows={4}
          className="border p-3 rounded-lg w-full mb-4"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
        />

        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg">
          Create Task
        </button>

      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-4 gap-6">

          {columns.map((status) => (
            <div
              key={status}
              className="bg-slate-100 rounded-xl p-4"
            >

              <h2 className="font-bold mb-4">
                {status.replaceAll(
                  "_",
                  " "
                )}
              </h2>

              <div className="space-y-4">

                {tasks
                  .filter(
                    (t) =>
                      t.status ===
                      status
                  )
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg shadow p-4"
                    >

                      <h3 className="font-semibold">
                        {task.title}
                      </h3>

                      <p className="text-gray-500 mt-2 text-sm">
                        {
                          task.description
                        }
                      </p>

                      <div className="flex gap-2 mt-5">

                        <button
                          onClick={() =>
                            navigate(
                              `/tasks/${task.id}`
                            )
                          }
                          className="flex-1 bg-indigo-600 text-white rounded py-2"
                        >
                          Open
                        </button>

                        {status !==
                          "DONE" && (
                          <button
                            onClick={() =>
                              nextStatus(
                                task
                              )
                            }
                            className="bg-green-600 text-white px-3 rounded"
                          >
                            →
                          </button>
                        )}

                        <button
                          onClick={() =>
                            remove(
                              task.id
                            )
                          }
                          className="bg-red-500 text-white px-3 rounded"
                        >
                          X
                        </button>

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