import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function TaskDetails() {
  const { taskId } = useParams();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [members, setMembers] = useState([]);

  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

const getTask = async () => {
  const res = await api.get(`/tasks/${taskId}`);
  const taskData = res.data.data;

  setTask(taskData);

  const orgsRes = await api.get("/organizations");
  const organizations = orgsRes.data.data || [];

  for (const org of organizations) {
    const orgRes = await api.get(`/organizations/${org.id}`);
    const fullOrg = orgRes.data.data;

    const hasProject = fullOrg.projects?.some(
      (project) => project.id === taskData.projectId
    );

    if (hasProject) {
      setMembers(fullOrg.members || []);
      break;
    }
  }
};

  const getComments = async () => {
    const res = await api.get(`/comments/task/${taskId}`);
    setComments(res.data.data);
  };

  const getAttachments = async () => {
    const res = await api.get(`/attachments/task/${taskId}`);
    setAttachments(res.data.data);
  };

  const changeStatus = async (status) => {
    await api.patch(`/tasks/${taskId}/status`, { status });
    getTask();
  };

  const assignTask = async (e) => {
    e.preventDefault();

    await api.patch(`/tasks/${taskId}/assign`, {
      assigneeId,
    });

    setAssigneeId("");
    getTask();
  };

  const unassignTask = async () => {
    await api.patch(`/tasks/${taskId}/unassign`);
    getTask();
  };

  const addComment = async (e) => {
    e.preventDefault();

    await api.post("/comments", {
      content,
      taskId,
    });

    setContent("");
    getComments();
  };

  const addAttachment = async (e) => {
    e.preventDefault();

    await api.post("/attachments", {
      fileName,
      fileUrl,
      taskId,
    });

    setFileName("");
    setFileUrl("");
    getAttachments();
  };

  useEffect(() => {
    getTask();
    getComments();
    getAttachments();
  }, [taskId]);

  if (!task) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />

      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Assignee Member ID: {task.assigneeId || "None"}</p>

      <h2>Change Status</h2>
      <button onClick={() => changeStatus("TODO")}>TODO</button>
      <button onClick={() => changeStatus("IN_PROGRESS")}>IN_PROGRESS</button>
      <button onClick={() => changeStatus("IN_REVIEW")}>IN_REVIEW</button>
      <button onClick={() => changeStatus("DONE")}>DONE</button>

      <h2>Assign Task</h2>
      <form onSubmit={assignTask}>
        <select
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
        >
          <option value="">Select member</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.user?.name} - {member.role}
            </option>
          ))}
        </select>

        <button disabled={!assigneeId}>Assign</button>
      </form>

      <button onClick={unassignTask}>Unassign</button>

      <h2>Comments</h2>
      <form onSubmit={addComment}>
        <input
          placeholder="Comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button>Add Comment</button>
      </form>

      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
        </div>
      ))}

      <h2>Attachments</h2>
      <form onSubmit={addAttachment}>
        <input
          placeholder="File name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />

        <input
          placeholder="File URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
        />

        <button>Add Attachment</button>
      </form>

      {attachments.map((attachment) => (
        <div key={attachment.id}>
          <p>{attachment.fileName}</p>
          <a href={attachment.fileUrl} target="_blank">
            Open
          </a>
        </div>
      ))}
    </div>
  );
}