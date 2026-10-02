import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetExperience,
  adminCreateExperience,
  adminUpdateExperience,
  adminDeleteExperience,
} from "./adminApi";

function ExperienceManage() {
  const navigate = useNavigate();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    description: "",
    start_date: "",
    end_date: "",
    currently_working: false,
    display_order: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await adminGetExperience();
      setExperiences(data);
    } catch (err) {
      setError("Unable to load experience.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditClick = (exp) => {
    setIsEditing(true);
    setEditId(exp.id);
    setFormData({
      company: exp.company,
      role: exp.role,
      description: exp.description || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      currently_working: exp.currently_working,
      display_order: exp.display_order,
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      company: "",
      role: "",
      description: "",
      start_date: "",
      end_date: "",
      currently_working: false,
      display_order: 0,
    });
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    try {
      await adminDeleteExperience(id);
      setMessage("Experience deleted successfully.");
      fetchExperiences();
    } catch (err) {
      setError("Failed to delete experience.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      // Create a copy of formData to send
      const dataToSend = { ...formData };
      if (dataToSend.currently_working || !dataToSend.end_date) {
        dataToSend.end_date = null;
      }

      if (isEditing) {
        await adminUpdateExperience(editId, dataToSend);
        setMessage("Experience updated successfully.");
      } else {
        await adminCreateExperience(dataToSend);
        setMessage("New experience added successfully.");
      }
      
      handleCancelEdit();
      fetchExperiences();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && experiences.length === 0) {
    return (
      <main className="admin-loading-page">
        <div className="admin-loading-spinner" />
        <p>Loading experience...</p>
      </main>
    );
  }

  return (
    <main className="admin-manage-page" style={{ padding: "40px 20px", background: "#f7f7f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <header className="admin-manage-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <span className="admin-login-eyebrow">EXPERIENCE MANAGEMENT</span>
            <h1 style={{ fontSize: "32px", margin: "10px 0" }}>Manage Experience</h1>
            <p style={{ color: "#777", margin: 0 }}>Add or update your work experience.</p>
          </div>
          <button type="button" className="admin-logout-button" onClick={() => navigate("/admin/dashboard")}>
            ← Back to Dashboard
          </button>
        </header>

        {/* ADD / EDIT FORM */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            {isEditing ? "Edit Experience" : "Add New Experience"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Company Name</label>
                <input name="company" type="text" value={formData.company} onChange={handleChange} required />
              </div>
              <div className="admin-form-group">
                <label>Job Role / Title</label>
                <input name="role" type="text" value={formData.role} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Start Date</label>
                <input name="start_date" type="date" value={formData.start_date} onChange={handleChange} required />
              </div>
              <div className="admin-form-group">
                <label>End Date</label>
                <input name="end_date" type="date" value={formData.end_date} onChange={handleChange} disabled={formData.currently_working} />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "600" }}>
                <input type="checkbox" name="currently_working" checked={formData.currently_working} onChange={handleChange} style={{ width: "18px", height: "18px" }} />
                <span>I currently work here</span>
              </label>
            </div>

            <div className="admin-form-group" style={{ marginBottom: "20px" }}>
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={{ width: "100%", padding: "15px", border: "1px solid #dedede", borderRadius: "12px", fontFamily: "inherit" }} required />
            </div>

            <div className="admin-form-group" style={{ marginBottom: "25px" }}>
              <label>Display Order (Lower comes first)</label>
              <input name="display_order" type="number" value={formData.display_order} onChange={handleChange} />
            </div>

            {message && <div className="form-success" style={{ padding: "15px", background: "#e8f7ed", color: "#21663b", borderRadius: "10px", marginBottom: "20px" }}>{message}</div>}
            {error && <div className="admin-login-error" style={{ marginBottom: "20px" }}>{error}</div>}

            <div style={{ display: "flex", gap: "15px" }}>
              <button type="submit" className="admin-login-button" disabled={saving}>
                {saving ? "Saving..." : isEditing ? "Update Experience" : "Add Experience"}
              </button>
              {isEditing && (
                <button type="button" className="admin-logout-button" onClick={handleCancelEdit}>Cancel Edit</button>
              )}
            </div>
          </form>
        </section>

        {/* LIST */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", padding: "30px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            Existing Experience
          </h2>
          {experiences.length > 0 ? (
            <div style={{ display: "grid", gap: "10px" }}>
              {experiences.map(exp => (
                <div key={exp.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", background: "#fff", border: "1px solid #eee", borderRadius: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "16px", display: "block" }}>{exp.role} at {exp.company}</strong>
                    <span style={{ fontSize: "12px", color: "#777" }}>
                      {exp.start_date} - {exp.currently_working ? "Present" : exp.end_date} • Order: {exp.display_order}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEditClick(exp)} style={{ padding: "8px 15px", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(exp.id)} style={{ padding: "8px 15px", background: "#fff0ed", color: "#a8321d", border: "none", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#777" }}>No experience added yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default ExperienceManage;