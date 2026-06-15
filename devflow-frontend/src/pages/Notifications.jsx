import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const getNotifications = async () => {
    const res = await api.get("/notifications");
    setNotifications(res.data.data);
  };

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    getNotifications();
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Notifications</h1>

      {notifications.map((n) => (
        <div key={n.id}>
          <h3>{n.title}</h3>
          <p>{n.message}</p>
          <p>{n.type}</p>
          <p>{n.isRead ? "Read" : "Unread"}</p>
          {!n.isRead && <button onClick={() => markRead(n.id)}>Mark Read</button>}
        </div>
      ))}
    </div>
  );
}