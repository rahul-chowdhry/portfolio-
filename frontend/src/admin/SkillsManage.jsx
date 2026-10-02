import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetSkills,
  adminCreateSkill,
  adminUpdateSkill,
  adminDeleteSkill,
} from "./adminApi";

function SkillsManage() {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "development",
    proficiency: 80,
    display_order: 0,
    is_active: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await adminGetSkills();
      setSkills(data);
    } catch (err) {
      setError("Unable to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditClick = (skill) => {
    setIsEditing(true);
    setEditId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      display_order: skill.display_order,
      is_active: skill.is_active,
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: "",
      category: "development",
      proficiency: 80,
      display_order: 0,
      is_active: true,
    });
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    
    try {
      await adminDeleteSkill(id);
      setMessage("Skill deleted successfully.");
      fetchSkills();
    } catch (err) {
      setError("Failed to delete skill.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (isEditing) {
        await adminUpdateSkill(editId, formData);
        setMessage("Skill updated successfully.");
      } else {
        await adminCreateSkill(formData);
        setMessage("New skill added successfully.");
      }
      
      handleCancelEdit(); // Reset form
      fetchSkills(); // Reload list
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && skills.length === 0) {
    return (
      <main className="admin-loading-page">
        <div className="admin-loading-spinner" />
        <p>Loading skills...</p>
      </main>
    );
  }

  return (
    <main className="admin-manage-page" style={{ padding: "40px 20px", background: "#f7f7f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <header className="admin-manage-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <span className="admin-login-eyebrow">SKILLS MANAGEMENT</span>
            <h1 style={{ fontSize: "32px", margin: "10px 0" }}>Manage Skills</h1>
            <p style={{ color: "#777", margin: 0 }}>
              Add, update or remove skills displayed on your portfolio.
            </p>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* ADD / EDIT FORM */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            {isEditing ? "Edit Skill" : "Add New Skill"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Skill Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. React.js, Python, Video Editing"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  style={{ width: "100%", padding: "15px 16px", border: "1px solid #dedede", borderRadius: "12px", background: "#fff" }}
                >
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="video">Video</option>
                  <option value="hardware">Hardware</option>
                  <option value="tools">Tools</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Proficiency (0 - 100)</label>
                <input
                  name="proficiency"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Display Order (Lower comes first)</label>
                <input
                  name="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "600" }}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px" }}
                />
                <span>Active (Visible on website)</span>
              </label>
            </div>

            {message && <div className="form-success" style={{ padding: "15px", background: "#e8f7ed", color: "#21663b", borderRadius: "10px", marginBottom: "20px" }}>{message}</div>}
            {error && <div className="admin-login-error" style={{ marginBottom: "20px" }}>{error}</div>}

            <div style={{ display: "flex", gap: "15px" }}>
              <button type="submit" className="admin-login-button" disabled={saving}>
                {saving ? "Saving..." : isEditing ? "Update Skill" : "Add Skill"}
              </button>
              
              {isEditing && (
                <button type="button" className="admin-logout-button" onClick={handleCancelEdit}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* SKILLS LIST */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", padding: "30px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            Existing Skills
          </h2>

          {skills.length > 0 ? (
            <div style={{ display: "grid", gap: "10px" }}>
              {skills.map(skill => (
                <div key={skill.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", background: "#fff", border: "1px solid #eee", borderRadius: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "16px", display: "block" }}>{skill.name}</strong>
                    <span style={{ fontSize: "12px", color: "#777", textTransform: "capitalize" }}>
                      {skill.category} • {skill.proficiency}% • Order: {skill.display_order} • {skill.is_active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                      onClick={() => handleEditClick(skill)}
                      style={{ padding: "8px 15px", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(skill.id)}
                      style={{ padding: "8px 15px", background: "#fff0ed", color: "#a8321d", border: "none", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#777" }}>No skills added yet. Create one above!</p>
          )}
        </section>

      </div>
    </main>
  );
}

export default SkillsManage;