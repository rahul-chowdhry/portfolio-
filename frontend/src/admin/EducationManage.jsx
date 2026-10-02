import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetEducation,
  adminCreateEducation,
  adminUpdateEducation,
  adminDeleteEducation,
} from "./adminApi";

function EducationManage() {
  const navigate = useNavigate();

  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    description: "",
    start_date: "",
    end_date: "",
    display_order: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const data = await adminGetEducation();
      setEducations(data);
    } catch (err) {
      setError("Unable to load education.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (edu) => {
    setIsEditing(true);
    setEditId(edu.id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      description: edu.description || "",
      start_date: edu.start_date || "",
      end_date: edu.end_date || "",
      display_order: edu.display_order,
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      institution: "",
      degree: "",
      description: "",
      start_date: "",
      end_date: "",
      display_order: 0,
    });
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this education?")) return;
    try {
      await adminDeleteEducation(id);
      setMessage("Education deleted successfully.");
      fetchEducations();
    } catch (err) {
      setError("Failed to delete education.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const dataToSend = { ...formData };
      if (!dataToSend.start_date) dataToSend.start_date = null;
      if (!dataToSend.end_date) dataToSend.end_date = null;

      if (isEditing) {
        await adminUpdateEducation(editId, dataToSend);
        setMessage("Education updated successfully.");
      } else {
        await adminCreateEducation(dataToSend);
        setMessage("New education added successfully.");
      }
      
      handleCancelEdit();
      fetchEducations();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && educations.length === 0) {
    return (
      <main className="admin-loading-page">
        <div className="admin-loading-spinner" />
        <p>Loading education...</p>
      </main>
    );
  }

  return (
    <main className="admin-manage-page" style={{ padding: "40px 20px", background: "#f7f7f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <header className="admin-manage-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <span className="admin-login-eyebrow">EDUCATION MANAGEMENT</span>
            <h1 style={{ fontSize: "32px", margin: "10px 0" }}>Manage Education</h1>
            <p style={{ color: "#777", margin: 0 }}>Add or update your academic background.</p>
          </div>
          <button type="button" className="admin-logout-button" onClick={() => navigate("/admin/dashboard")}>
            ← Back to Dashboard
          </button>
        </header>

        {/* ADD / EDIT FORM */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            {isEditing ? "Edit Education" : "Add New Education"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Institution / University Name</label>
                <input name="institution" type="text" value={formData.institution} onChange={handleChange} required />
              </div>
              <div className="admin-form-group">
                <label>Degree / Course</label>
                <input name="degree" type="text" value={formData.degree} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Start Date</label>
                <input name="start_date" type="date" value={formData.start_date} onChange={handleChange} />
              </div>
              <div className="admin-form-group">
                <label>End Date</label>
                <input name="end_date" type="date" value={formData.end_date} onChange={handleChange} />
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: "20px" }}>
              <label>Description (Optional)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={{ width: "100%", padding: "15px", border: "1px solid #dedede", borderRadius: "12px", fontFamily: "inherit" }} />
            </div>

            <div className="admin-form-group" style={{ marginBottom: "25px" }}>
              <label>Display Order (Lower comes first)</label>
              <input name="display_order" type="number" value={formData.display_order} onChange={handleChange} />
            </div>

            {message && <div className="form-success" style={{ padding: "15px", background: "#e8f7ed", color: "#21663b", borderRadius: "10px", marginBottom: "20px" }}>{message}</div>}
            {error && <div className="admin-login-error" style={{ marginBottom: "20px" }}>{error}</div>}

            <div style={{ display: "flex", gap: "15px" }}>
              <button type="submit" className="admin-login-button" disabled={saving}>
                {saving ? "Saving..." : isEditing ? "Update Education" : "Add Education"}
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
            Existing Education
          </h2>
          {educations.length > 0 ? (
            <div style={{ display: "grid", gap: "10px" }}>
              {educations.map(edu => (
                <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", background: "#fff", border: "1px solid #eee", borderRadius: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "16px", display: "block" }}>{edu.degree} from {edu.institution}</strong>
                    <span style={{ fontSize: "12px", color: "#777" }}>
                      Order: {edu.display_order}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEditClick(edu)} style={{ padding: "8px 15px", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(edu.id)} style={{ padding: "8px 15px", background: "#fff0ed", color: "#a8321d", border: "none", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#777" }}>No education added yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default EducationManage;