import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../Navbar";
import { ACCENT, TEXT_MUTED, cardStyle, pageHeading, errorMsgStyle } from "../theme";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const response = await api.get(
        "/notifications/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(response.data);
    } catch (err) {
      setError("Failed to load notifications.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(
        `/notifications/read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (err) {
      setError("Failed to mark as read.");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(
        `/notifications/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (err) {
      setError("Failed to delete notification.");
    }
  };

  const markReadButtonStyle = {
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: "bold",
    borderRadius: "6px",
    border: `1px solid ${ACCENT}`,
    background: "#fff",
    color: ACCENT,
    cursor: "pointer",
  };

  const deleteButtonStyle = {
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: "bold",
    borderRadius: "6px",
    border: "1px solid #c62828",
    background: "#fff",
    color: "#c62828",
    cursor: "pointer",
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>
        <h1 style={pageHeading}>Notifications</h1>
        {error && <p style={errorMsgStyle}>{error}</p>}
        {notifications.length === 0 && !error && (
          <p style={{ color: TEXT_MUTED, textAlign: "center" }}>No notifications.</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                ...cardStyle,
                padding: "14px 18px",
                background: n.isRead ? "#fff" : "#eef4ff",
                border: n.isRead ? cardStyle.border : "1px solid #bcd4ff",
              }}
            >
              <p style={{ margin: "0 0 10px", color: "#222" }}>{n.message}</p>
              <div style={{ display: "flex", gap: "10px" }}>
                {!n.isRead && (
                  <button onClick={() => markAsRead(n.id)} style={markReadButtonStyle}>
                    Mark as read
                  </button>
                )}
                <button onClick={() => deleteNotification(n.id)} style={deleteButtonStyle}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;