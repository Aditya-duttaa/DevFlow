import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  getTask,
  updateTask,
  changeTaskStatus,
  deleteTask,
  assignTask,
  unassignTask,
} from "../../api/taskApi";
import useWorkspaceStore from "../../store/workspaceStore";
import MemberPicker from "../../components/member/MemberPicker";

import {
  getComments,
  createComment,
  deleteComment,
} from "../../api/commentApi";

import {
  getAttachments,
  createAttachment,
  deleteAttachment,
} from "../../api/attachmentApi";


const statuses = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
];

export default function TaskDetails() {
  const { taskId } = useParams();
  const {
    currentOrganization,
    currentMember,
  } = useWorkspaceStore();

  const [task, setTask] = useState(null);

  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);

  const [attachments, setAttachments] =
    useState([]);

  const [editMode, setEditMode] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [comment, setComment] =
    useState("");

  const [attachment, setAttachment] =
    useState({
      fileName: "",
      fileUrl: "",
      fileType: "",
      fileSize: "",
    });

  async function loadData() {
    setLoading(true);

    try {
      const taskData = await getTask(taskId);

      setTask(taskData);

      setForm({
        title: taskData.title,
        description:
          taskData.description || "",
      });

      const commentData =
        await getComments(taskId);

      setComments(commentData);

      const attachmentData =
        await getAttachments(taskId);

      setAttachments(attachmentData);
    } catch {
      toast.error(
        "Failed to load task"
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [taskId]);

  async function saveTask() {
    try {
      const updated =
        await updateTask(task.id, form);

      setTask(updated);

      setEditMode(false);

      toast.success(
        "Task Updated"
      );
    } catch (e) {
      toast.error(
        e.response?.data?.message
      );
    }
  }

  async function updateStatus(status) {
    try {
      const updated =
        await changeTaskStatus(
          task.id,
          status
        );

      setTask(updated);

      toast.success(
        "Status Updated"
      );
    } catch {
      toast.error(
        "Failed to update"
      );
    }
  }

  async function updateAssignee(assigneeId) {
    try {
      const updated = assigneeId
        ? await assignTask(task.id, assigneeId)
        : await unassignTask(task.id);

      setTask(updated);

      toast.success(
        assigneeId
          ? "Task assigned"
          : "Task unassigned"
      );
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Failed to update assignee"
      );
    }
  }

  async function removeTask() {
    if (
      !window.confirm(
        "Delete this task?"
      )
    )
      return;

    try {
      await deleteTask(task.id);

      toast.success(
        "Task Deleted"
      );

      window.history.back();
    } catch {
      toast.error(
        "Delete Failed"
      );
    }
  }

  async function addComment(e) {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      const newComment =
        await createComment({
          content: comment,
          taskId,
        });

      setComments([
        newComment,
        ...comments,
      ]);

      setComment("");

      toast.success(
        "Comment Added"
      );
    } catch {
      toast.error(
        "Failed"
      );
    }
  }

  async function removeComment(id) {
    if (
      !window.confirm(
        "Delete comment?"
      )
    )
      return;

    try {
      await deleteComment(id);

      setComments(
        comments.filter(
          (c) => c.id !== id
        )
      );

      toast.success(
        "Comment Deleted"
      );
    } catch {
      toast.error(
        "Failed"
      );
    }
  }
    async function addAttachment(e) {
    e.preventDefault();

    if (
      !attachment.fileName ||
      !attachment.fileUrl
    ) {
      toast.error("File name and URL are required");
      return;
    }

    try {
      const newAttachment =
        await createAttachment({
          ...attachment,
          fileSize: attachment.fileSize
            ? Number(attachment.fileSize)
            : undefined,
          taskId,
        });

      setAttachments([
        newAttachment,
        ...attachments,
      ]);

      setAttachment({
        fileName: "",
        fileUrl: "",
        fileType: "",
        fileSize: "",
      });

      toast.success("Attachment Added");
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Failed to add attachment"
      );
    }
  }

  async function removeAttachment(id) {
    if (
      !window.confirm(
        "Delete attachment?"
      )
    )
      return;

    try {
      await deleteAttachment(id);

      setAttachments(
        attachments.filter(
          (a) => a.id !== id
        )
      );

      toast.success(
        "Attachment Deleted"
      );
    } catch {
      toast.error("Delete Failed");
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-20">
        Task Not Found
      </div>
    );
  }

  const canAssign =
    currentMember?.role === "OWNER" ||
    currentMember?.role === "ADMIN" ||
    currentMember?.role === "MANAGER";

  return (
    <div className="space-y-8">

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex justify-between items-center">

          <div>

            {editMode ? (
              <input
                className="border rounded-lg p-3 w-full text-2xl font-bold"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
              />
            ) : (
              <h1 className="text-3xl font-bold">
                {task.title}
              </h1>
            )}

            <p className="text-gray-500 mt-2">
              Task ID: {task.id}
            </p>

          </div>

          <button
            onClick={removeTask}
            className="bg-red-500 text-white px-5 py-2 rounded-lg"
          >
            Delete
          </button>

        </div>

        <div className="mt-8">

          <label className="font-semibold">
            Description
          </label>

          {editMode ? (
            <textarea
              rows={5}
              className="border rounded-lg p-3 w-full mt-2"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
            />
          ) : (
            <p className="mt-3 whitespace-pre-wrap">
              {task.description ||
                "No description"}
            </p>
          )}

        </div>

        <div className="mt-8">

          <label className="font-semibold">
            Status
          </label>

          <select
            value={task.status}
            onChange={(e) =>
              updateStatus(
                e.target.value
              )
            }
            className="border rounded-lg p-3 mt-2 ml-4"
          >
            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status.replaceAll(
                  "_",
                  " "
                )}
              </option>
            ))}
          </select>

        </div>

        <div className="mt-8">
          {canAssign ? (
            <MemberPicker
              members={currentOrganization?.members ?? []}
              selectedMemberId={task.assigneeId || ""}
              onSelect={updateAssignee}
            />
          ) : (
            <div>
              <label className="font-semibold">
                Assignee
              </label>
              <p className="mt-2 text-gray-600">
                {task.assignee?.user?.name ||
                  "Unassigned"}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-4">

          {editMode ? (
            <>
              <button
                onClick={saveTask}
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() =>
                  setEditMode(false)
                }
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() =>
                setEditMode(true)
              }
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              Edit Task
            </button>
          )}

        </div>

      </div>
            {/* Comments */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          Comments
        </h2>

        <form
          onSubmit={addComment}
          className="flex gap-4 mb-8"
        >

          <input
            className="flex-1 border rounded-lg p-3"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
          />

          <button
            className="bg-indigo-600 text-white px-6 rounded-lg"
          >
            Add
          </button>

        </form>

        <div className="space-y-4">

          {comments.length === 0 ? (
            <p className="text-gray-500">
              No comments yet.
            </p>
          ) : (
            comments.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <p>{item.content}</p>

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(
                      item.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() =>
                    removeComment(item.id)
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </div>
            ))
          )}

        </div>

      </div>

      {/* Attachments */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          Attachments
        </h2>

        <form
          onSubmit={addAttachment}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >

          <input
            className="border rounded-lg p-3"
            placeholder="File Name"
            value={attachment.fileName}
            onChange={(e) =>
              setAttachment({
                ...attachment,
                fileName: e.target.value,
              })
            }
          />

          <input
            className="border rounded-lg p-3"
            placeholder="File URL"
            value={attachment.fileUrl}
            onChange={(e) =>
              setAttachment({
                ...attachment,
                fileUrl: e.target.value,
              })
            }
          />

          <input
            className="border rounded-lg p-3"
            placeholder="File Type"
            value={attachment.fileType}
            onChange={(e) =>
              setAttachment({
                ...attachment,
                fileType: e.target.value,
              })
            }
          />

          <input
            type="number"
            className="border rounded-lg p-3"
            placeholder="File Size (bytes)"
            value={attachment.fileSize}
            onChange={(e) =>
              setAttachment({
                ...attachment,
                fileSize: e.target.value,
              })
            }
          />

          <button
            className="bg-indigo-600 text-white rounded-lg py-3 md:col-span-2"
          >
            Add Attachment
          </button>

        </form>

        <div className="space-y-4">

          {attachments.length === 0 ? (
            <p className="text-gray-500">
              No attachments.
            </p>
          ) : (
            attachments.map((file) => (
              <div
                key={file.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>

                  <h3 className="font-semibold">
                    {file.fileName}
                  </h3>

                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    Open File
                  </a>

                  {file.fileType && (
                    <p className="text-xs text-gray-500 mt-1">
                      Type: {file.fileType}
                    </p>
                  )}

                  {file.fileSize && (
                    <p className="text-xs text-gray-500">
                      {file.fileSize} bytes
                    </p>
                  )}

                </div>

                <button
                  onClick={() =>
                    removeAttachment(file.id)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}
