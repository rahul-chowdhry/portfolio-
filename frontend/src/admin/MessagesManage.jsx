import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetMessages,
  adminUpdateMessage,
  adminDeleteMessage,
} from "./adminApi";

function MessagesManage() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await adminGetMessages();
      setMessages(data);
    } catch (err) {
      setError("Unable to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminUpdateMessage(id, { status: newStatus });
      // UI ko manually update kar dete hain fast response ke liye
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await adminDeleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      alert("Failed to delete message.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new": return "#ef6c25"; // Orange
      case "read": return "#4a90e2"; // Blue
      case "contacted": return "#f5a623"; // Yellow
      case "closed": return "#45a95d"; // Green
      default: return "#777";
    }
  };

  if (loading && messages.length === 0) {
    return (
      <main className="admin-loading-page">
        <div className="admin-loading-spinner" />
        <p>Loading messages...</p>
      </main>
    );
  }

  return (
    <main className="admin-manage-page" style={{ padding: "40px 20px", background: "#f7f7f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        <header className="admin-manage-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <span className="admin-login-eyebrow">INBOX</span>
            <h1 style={{ fontSize: "32px", margin: "10px 0" }}>Contact Messages</h1>
            <p style={{ color: "#777", margin: 0 }}>View and manage tickets from your website's contact form.</p>
          </div>
          <button type="button" className="admin-logout-button" onClick={() => navigate("/admin/dashboard")}>
            ← Back to Dashboard
          </button>
        </header>

        {error && <div className="admin-login-error" style={{ marginBottom: "20px" }}>{error}</div>}

        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", padding: "30px", background: "transparent", border: "none", boxShadow: "none" }}>
          {messages.length > 0 ? (
            <div style={{ display: "grid", gap: "20px" }}>
              {messages.map((msg) => (
                <article key={msg.id} style={{ background: "#fff", border: "1px solid #e2e2e2", borderRadius: "16px", padding: "25px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 5px", fontSize: "18px" }}>{msg.subject || "No Subject"}</h3>
                      <div style={{ fontSize: "13px", color: "#555" }}>
                        <strong>From:</strong> {msg.name} (<a href={`mailto:${msg.email}`} style={{ color: "#ef6c25" }}>{msg.email}</a>)
                      </div>
                      <div style={{ fontSize: "11px", color: "#999", marginTop: "5px" }}>
                        Received: {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <select 
                        value={msg.status} 
                        onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                        style={{ padding: "8px 12px", border: `1px solid ${getStatusColor(msg.status)}`, borderRadius: "8px", background: "#fff", color: getStatusColor(msg.status), fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>

                      <button onClick={() => handleDelete(msg.id)} style={{ padding: "8px", background: "#fff0ed", color: "#a8321d", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>
                        Delete
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: "14px", color: "#333", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                    {msg.message}
                  </div>

                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "50px", background: "#fff", borderRadius: "16px", border: "1px dashed #ccc" }}>
              <h3 style={{ margin: "0 0 10px", fontSize: "20px" }}>Inbox is empty</h3>
              <p style={{ color: "#777", margin: 0 }}>You have no new messages from the website.</p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default MessagesManage;