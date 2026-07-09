import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { getOrganization } from "../../api/organizationApi";
import {
  getTask,
  updateTask,
  changeTaskStatus,
  assignTask,
  unassignTask,
} from "../../api/taskApi";
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
import useWorkspaceStore from "../../store/workspaceStore";
import MemberPicker from "../../components/member/MemberPicker";

const statuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

function AttachmentPreview({ file }) {
  const isImage = file.fileType?.startsWith("image/");
  const isPdf = file.fileType === "application/pdf";

  return (
    <div>
      {isImage && (
        <img
          src={file.fileUrl}
          alt=""
          className="mb-3 h-32 w-full rounded object-cover"
        />
      )}
      <h3 className="font-semibold">{file.fileName}</h3>
      <p className="text-xs text-gray-500">
        {file.fileType || "Unknown type"}
        {file.fileSize ? ` - ${file.fileSize} bytes` : ""}
      </p>
      <a
        href={file.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
      >
        {isPdf ? "Open PDF" : "Open File"}
      </a>
    </div>
  );
}

export default function TaskDetails() {
  const { taskId } = useParams();
  const queryClient = useQueryClient();
  const {
    currentOrganization,
    currentMember,
    setCurrentOrganizationDetails,
    setCurrentMember,
  } = useWorkspaceStore();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const taskKey = ["task", taskId];
  const commentsKey = ["comments", taskId];
  const attachmentsKey = ["attachments", taskId];

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

  const taskQuery = useQuery({
    queryKey: taskKey,
    queryFn: () => getTask(taskId),
  });

  const commentsQuery = useQuery({
    queryKey: commentsKey,
    queryFn: () => getComments(taskId),
  });

  const attachmentsQuery = useQuery({
    queryKey: attachmentsKey,
    queryFn: () => getAttachments(taskId),
  });

  useEffect(() => {
    if (taskQuery.data) {
      setForm({
        title: taskQuery.data.title,
        description: taskQuery.data.description || "",
      });
    }
  }, [taskQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateTask(taskId, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: taskKey });
      const previous = queryClient.getQueryData(taskKey);
      queryClient.setQueryData(taskKey, (current) => ({
        ...current,
        ...data,
      }));
      return { previous };
    },
    onError: (e, data, context) => {
      queryClient.setQueryData(taskKey, context?.previous);
      toast.error(e.response?.data?.message || "Update failed");
    },
    onSuccess: () => {
      setEditMode(false);
      toast.success("Task Updated");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: taskKey }),
  });

  const statusMutation = useMutation({
    mutationFn: (status) => changeTaskStatus(taskId, status),
    onMutate: async (status) => {
      await queryClient.cancelQueries({ queryKey: taskKey });
      const previous = queryClient.getQueryData(taskKey);
      queryClient.setQueryData(taskKey, (current) => ({
        ...current,
        status,
      }));
      return { previous };
    },
    onError: (e, status, context) => {
      queryClient.setQueryData(taskKey, context?.previous);
      toast.error("Failed to update");
    },
    onSuccess: () => toast.success("Status Updated"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: taskKey }),
  });

  const assigneeMutation = useMutation({
    mutationFn: (assigneeId) =>
      assigneeId ? assignTask(taskId, assigneeId) : unassignTask(taskId),
    onMutate: async (assigneeId) => {
      await queryClient.cancelQueries({ queryKey: taskKey });
      const previous = queryClient.getQueryData(taskKey);
      const assignee = members.find((member) => member.id === assigneeId);
      queryClient.setQueryData(taskKey, (current) => ({
        ...current,
        assigneeId: assigneeId || null,
        assignee: assignee || null,
      }));
      return { previous };
    },
    onError: (e, assigneeId, context) => {
      queryClient.setQueryData(taskKey, context?.previous);
      toast.error(
        e.response?.data?.message || "Failed to update assignee"
      );
    },
    onSuccess: (_, assigneeId) => {
      toast.success(assigneeId ? "Task assigned" : "Task unassigned");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: taskKey }),
  });

  const addCommentMutation = useMutation({
    mutationFn: createComment,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });
      const previous = queryClient.getQueryData(commentsKey) ?? [];
      const optimistic = {
        id: `temp-${Date.now()}`,
        content: data.content,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData(commentsKey, [optimistic, ...previous]);
      return { previous };
    },
    onError: (e, data, context) => {
      queryClient.setQueryData(commentsKey, context?.previous ?? []);
      toast.error("Failed");
    },
    onSuccess: () => {
      setComment("");
      toast.success("Comment Added");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: commentsKey }),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });
      const previous = queryClient.getQueryData(commentsKey) ?? [];
      queryClient.setQueryData(commentsKey, (current = []) =>
        current.filter((item) => item.id !== id)
      );
      return { previous };
    },
    onError: (e, id, context) => {
      queryClient.setQueryData(commentsKey, context?.previous ?? []);
      toast.error("Failed");
    },
    onSuccess: () => toast.success("Comment Deleted"),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: commentsKey }),
  });

  const uploadMutation = useMutation({
    mutationFn: createAttachment,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: attachmentsKey });
      const previous = queryClient.getQueryData(attachmentsKey) ?? [];
      const optimistic = {
        id: `temp-${Date.now()}`,
        fileName: data.file.name,
        fileUrl: URL.createObjectURL(data.file),
        fileType: data.file.type,
        fileSize: data.file.size,
      };
      queryClient.setQueryData(attachmentsKey, [optimistic, ...previous]);
      return { previous };
    },
    onError: (e, data, context) => {
      queryClient.setQueryData(attachmentsKey, context?.previous ?? []);
      toast.error(
        e.response?.data?.message || "Failed to upload attachment"
      );
    },
    onSuccess: () => {
      setSelectedFile(null);
      toast.success("Attachment uploaded");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: attachmentsKey }),
  });

  const deleteAttachmentMutation = useMutation({
    mutationFn: deleteAttachment,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: attachmentsKey });
      const previous = queryClient.getQueryData(attachmentsKey) ?? [];
      queryClient.setQueryData(attachmentsKey, (current = []) =>
        current.filter((file) => file.id !== id)
      );
      return { previous };
    },
    onError: (e, id, context) => {
      queryClient.setQueryData(attachmentsKey, context?.previous ?? []);
      toast.error("Delete Failed");
    },
    onSuccess: () => toast.success("Attachment Deleted"),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: attachmentsKey }),
  });

  if (taskQuery.isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const task = taskQuery.data;
  const comments = commentsQuery.data ?? [];
  const attachments = attachmentsQuery.data ?? [];
  const canAssign =
    currentMember?.role === "OWNER" ||
    currentMember?.role === "ADMIN" ||
    currentMember?.role === "MANAGER";

  if (!task) {
    return <div className="text-center py-20">Task Not Found</div>;
  }

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
                  setForm({ ...form, title: e.target.value })
                }
              />
            ) : (
              <h1 className="text-3xl font-bold">{task.title}</h1>
            )}
            <p className="text-gray-500 mt-2">Task ID: {task.id}</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-slate-200 px-5 py-2 rounded-lg"
          >
            Back
          </button>
        </div>

        <div className="mt-8">
          <label className="font-semibold">Description</label>
          {editMode ? (
            <textarea
              rows={5}
              className="border rounded-lg p-3 w-full mt-2"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          ) : (
            <p className="mt-3 whitespace-pre-wrap">
              {task.description || "No description"}
            </p>
          )}
        </div>

        <div className="mt-8">
          <label className="font-semibold">Status</label>
          <select
            value={task.status}
            onChange={(e) => statusMutation.mutate(e.target.value)}
            className="border rounded-lg p-3 mt-2 ml-4"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8">
          {canAssign ? (
            <MemberPicker
              members={members}
              selectedMemberId={task.assigneeId || ""}
              onSelect={(assigneeId) =>
                assigneeMutation.mutate(assigneeId)
              }
            />
          ) : (
            <div>
              <label className="font-semibold">Assignee</label>
              <p className="mt-2 text-gray-600">
                {task.assignee?.user?.name || "Unassigned"}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          {editMode ? (
            <>
              <button
                onClick={() => updateMutation.mutate(form)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              Edit Task
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!comment.trim()) return;
            addCommentMutation.mutate({ content: comment, taskId });
          }}
          className="flex gap-4 mb-8"
        >
          <input
            className="flex-1 border rounded-lg p-3"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="bg-indigo-600 text-white px-6 rounded-lg">
            Add
          </button>
        </form>
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            comments.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <p>{item.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteCommentMutation.mutate(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Attachments</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!selectedFile) {
              toast.error("Choose a file first");
              return;
            }
            uploadMutation.mutate({ taskId, file: selectedFile });
          }}
          className="mb-8 flex flex-col gap-4"
        >
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="border rounded-lg p-3"
          />
          {selectedFile && (
            <p className="text-sm text-gray-600">
              Selected: {selectedFile.name}
            </p>
          )}
          <button
            disabled={uploadMutation.isPending}
            className="bg-indigo-600 text-white rounded-lg py-3 px-6 w-fit disabled:opacity-50"
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload Attachment"}
          </button>
        </form>

        <div className="grid md:grid-cols-2 gap-4">
          {attachments.length === 0 ? (
            <p className="text-gray-500">No attachments.</p>
          ) : (
            attachments.map((file) => (
              <div
                key={file.id}
                className="border rounded-lg p-4 flex justify-between gap-4"
              >
                <AttachmentPreview file={file} />
                <button
                  onClick={() => deleteAttachmentMutation.mutate(file.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg h-fit"
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
