import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetSocialLinks,
  adminCreateSocialLink,
  adminUpdateSocialLink,
  adminDeleteSocialLink,
} from "./adminApi";

function SocialLinksManage() {
  const navigate = useNavigate();

  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    icon: "",
    display_order: 0,
    is_active: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const data = await adminGetSocialLinks();
      setSocialLinks(data);
    } catch (err) {
      setError("Unable to load social links.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditClick = (link) => {
    setIsEditing(true);
    setEditId(link.id);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon || "",
      display_order: link.display_order,
      is_active: link.is_active,
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      platform: "",
      url: "",
      icon: "",
      display_order: 0,
      is_active: true,
    });
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      await adminDeleteSocialLink(id);
      setMessage("Link deleted successfully.");
      fetchSocialLinks();
    } catch (err) {
      setError("Failed to delete link.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (isEditing) {
        await adminUpdateSocialLink(editId, formData);
        setMessage("Link updated successfully.");
      } else {
        await adminCreateSocialLink(formData);
        setMessage("New link added successfully.");
      }
      
      handleCancelEdit();
      fetchSocialLinks();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && socialLinks.length === 0) {
    return (
      <main className="admin-loading-page">
        <div className="admin-loading-spinner" />
        <p>Loading social links...</p>
      </main>
    );
  }

  return (
    <main className="admin-manage-page" style={{ padding: "40px 20px", background: "#f7f7f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <header className="admin-manage-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <span className="admin-login-eyebrow">SOCIAL MANAGEMENT</span>
            <h1 style={{ fontSize: "32px", margin: "10px 0" }}>Manage Social Links</h1>
            <p style={{ color: "#777", margin: 0 }}>Update your public social media profiles.</p>
          </div>
          <button type="button" className="admin-logout-button" onClick={() => navigate("/admin/dashboard")}>
            ← Back to Dashboard
          </button>
        </header>

        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            {isEditing ? "Edit Link" : "Add New Link"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Platform Name</label>
                <input name="platform" type="text" value={formData.platform} onChange={handleChange} placeholder="e.g. Instagram, LinkedIn" required />
              </div>
              <div className="admin-form-group">
                <label>Profile URL</label>
                <input name="url" type="url" value={formData.url} onChange={handleChange} placeholder="https://..." required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Icon Text (Optional)</label>
                <input name="icon" type="text" value={formData.icon} onChange={handleChange} placeholder="e.g. ig, in" />
              </div>
              <div className="admin-form-group">
                <label>Display Order (Lower comes first)</label>
                <input name="display_order" type="number" value={formData.display_order} onChange={handleChange} />
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "600" }}>
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} style={{ width: "18px", height: "18px" }} />
                <span>Active (Visible on footer)</span>
              </label>
            </div>

            {message && <div className="form-success" style={{ padding: "15px", background: "#e8f7ed", color: "#21663b", borderRadius: "10px", marginBottom: "20px" }}>{message}</div>}
            {error && <div className="admin-login-error" style={{ marginBottom: "20px" }}>{error}</div>}

            <div style={{ display: "flex", gap: "15px" }}>
              <button type="submit" className="admin-login-button" disabled={saving}>
                {saving ? "Saving..." : isEditing ? "Update Link" : "Add Link"}
              </button>
              {isEditing && (
                <button type="button" className="admin-logout-button" onClick={handleCancelEdit}>Cancel Edit</button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", padding: "30px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            Existing Links
          </h2>
          {socialLinks.length > 0 ? (
            <div style={{ display: "grid", gap: "10px" }}>
              {socialLinks.map(link => (
                <div key={link.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", background: "#fff", border: "1px solid #eee", borderRadius: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "16px", display: "block" }}>{link.platform}</strong>
                    <a href={link.url} target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: "#ef6c25", display: "block", marginBottom: "5px" }}>{link.url}</a>
                    <span style={{ fontSize: "12px", color: "#777" }}>
                      Order: {link.display_order} • {link.is_active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEditClick(link)} style={{ padding: "8px 15px", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(link.id)} style={{ padding: "8px 15px", background: "#fff0ed", color: "#a8321d", border: "none", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#777" }}>No links added yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default SocialLinksManage;