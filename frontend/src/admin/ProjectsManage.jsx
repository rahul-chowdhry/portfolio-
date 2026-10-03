import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminGetProjectImages,
  adminCreateProjectImage,
  adminDeleteProjectImage,
} from "./adminApi";

function ProjectsManage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [projectImages, setProjectImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // PROJECT FORM STATE
  // ==========================================
  const [projectForm, setProjectForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    full_description: "",
    technologiesText: "", // Comma separated string
    featuresText: "",     // Comma separated string
    github_url: "",
    live_url: "",
    featured: false,
    display_order: 0,
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);

  // ==========================================
  // GALLERY FORM STATE
  // ==========================================
  const [galleryForm, setGalleryForm] = useState({
    project: "",
    caption: "",
    display_order: 0,
  });
  const [galleryFile, setGalleryFile] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projData, imgData] = await Promise.all([
        adminGetProjects(),
        adminGetProjectImages(),
      ]);
      setProjects(projData);
      setProjectImages(imgData);
    } catch (err) {
      setError("Unable to load projects data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // PROJECT HANDLERS
  // ==========================================
  const handleProjectChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "title" && !isEditingProject) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setProjectForm((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files.length > 0) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", projectForm.title);
      formData.append("slug", projectForm.slug);
      formData.append("short_description", projectForm.short_description);
      formData.append("full_description", projectForm.full_description);
      formData.append("github_url", projectForm.github_url);
      formData.append("live_url", projectForm.live_url);
      formData.append("featured", projectForm.featured);
      formData.append("display_order", projectForm.display_order);

      // JSON stringify the arrays so Django can parse them
      const techArray = projectForm.technologiesText
        ? projectForm.technologiesText.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
      formData.append("technologies", JSON.stringify(techArray));

      const featuresArray = projectForm.featuresText
        ? projectForm.featuresText.split(",").map((f) => f.trim()).filter(Boolean)
        : [];
      formData.append("features", JSON.stringify(featuresArray));

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (isEditingProject) {
        await adminUpdateProject(editProjectId, formData);
        setMessage("Project updated successfully.");
      } else {
        await adminCreateProject(formData);
        setMessage("Project created successfully.");
      }

      setIsEditingProject(false);
      setEditProjectId(null);
      setThumbnailFile(null);
      document.getElementById("thumbnail_input").value = "";
      setProjectForm({
        title: "", slug: "", short_description: "", full_description: "",
        technologiesText: "", featuresText: "", github_url: "", live_url: "",
        featured: false, display_order: 0,
      });
      fetchData();
    } catch (err) {
      setError("Failed to save project. Check if slug is unique.");
    }
  };

  const handleEditProject = (proj) => {
    setIsEditingProject(true);
    setEditProjectId(proj.id);
    setProjectForm({
      title: proj.title,
      slug: proj.slug,
      short_description: proj.short_description,
      full_description: proj.full_description,
      technologiesText: Array.isArray(proj.technologies) ? proj.technologies.join(", ") : "",
      featuresText: Array.isArray(proj.features) ? proj.features.join(", ") : "",
      github_url: proj.github_url || "",
      live_url: proj.live_url || "",
      featured: proj.featured,
      display_order: proj.display_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure? This will delete the project and all its gallery images.")) return;
    try {
      await adminDeleteProject(id);
      setMessage("Project deleted.");
      fetchData();
    } catch (err) {
      setError("Failed to delete project.");
    }
  };

  // ==========================================
  // GALLERY HANDLERS
  // ==========================================
  const handleGalleryChange = (e) => {
    const { name, value } = e.target;
    setGalleryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGalleryFileChange = (e) => {
    if (e.target.files.length > 0) {
      setGalleryFile(e.target.files[0]);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryFile) {
      alert("Please select an image first.");
      return;
    }
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("project", galleryForm.project);
      formData.append("caption", galleryForm.caption);
      formData.append("display_order", galleryForm.display_order);
      formData.append("image", galleryFile);

      await adminCreateProjectImage(formData);
      setMessage("Gallery image added successfully.");
      
      setGalleryFile(null);
      document.getElementById("gallery_input").value = "";
      setGalleryForm({ project: "", caption: "", display_order: 0 });
      fetchData();
    } catch (err) {
      setError("Failed to save gallery image.");
    }
  };

  const handleDeleteGalleryImage = async (id) => {
    if (!window.confirm("Delete this gallery image?")) return;
    try {
      await adminDeleteProjectImage(id);
      setMessage("Image deleted.");
      fetchData();
    } catch (err) {
      setError("Failed to delete image.");
    }
  };

  if (loading && projects.length === 0) {
    return (
      <main className="admin-loading-page">
        <div className="admin-loading-spinner" />
        <p>Loading projects...</p>
      </main>
    );
  }

  return (
    <main className="admin-manage-page" style={{ padding: "40px 20px", background: "#f7f7f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        <header className="admin-manage-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <span className="admin-login-eyebrow">PORTFOLIO WORK</span>
            <h1 style={{ fontSize: "32px", margin: "10px 0" }}>Manage Projects</h1>
            <p style={{ color: "#777", margin: 0 }}>Add your projects and upload their screenshots.</p>
          </div>
          <button type="button" className="admin-logout-button" onClick={() => navigate("/admin/dashboard")}>
            ← Back to Dashboard
          </button>
        </header>

        {message && <div className="form-success" style={{ padding: "15px", background: "#e8f7ed", color: "#21663b", borderRadius: "10px", marginBottom: "25px" }}>{message}</div>}
        {error && <div className="admin-login-error" style={{ marginBottom: "25px" }}>{error}</div>}

        {/* 1. PROJECT FORM SECTION */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            {isEditingProject ? "Edit Project" : "Add New Project"}
          </h2>
          
          <form onSubmit={handleProjectSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Project Title</label>
                <input name="title" type="text" value={projectForm.title} onChange={handleProjectChange} required />
              </div>
              <div className="admin-form-group">
                <label>URL Slug</label>
                <input name="slug" type="text" value={projectForm.slug} onChange={handleProjectChange} required />
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: "20px" }}>
              <label>Short Description (Card View)</label>
              <input name="short_description" type="text" value={projectForm.short_description} onChange={handleProjectChange} required />
            </div>

            <div className="admin-form-group" style={{ marginBottom: "20px" }}>
              <label>Full Description (Detail Page)</label>
              <textarea name="full_description" value={projectForm.full_description} onChange={handleProjectChange} rows="4" style={{ width: "100%", padding: "15px", border: "1px solid #dedede", borderRadius: "12px", fontFamily: "inherit" }} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Technologies Used (Comma separated)</label>
                <input name="technologiesText" type="text" value={projectForm.technologiesText} onChange={handleProjectChange} placeholder="React, Django, MySQL" />
              </div>
              <div className="admin-form-group">
                <label>Features (Comma separated)</label>
                <input name="featuresText" type="text" value={projectForm.featuresText} onChange={handleProjectChange} placeholder="Admin Panel, File Upload, Responsive" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>GitHub URL</label>
                <input name="github_url" type="url" value={projectForm.github_url} onChange={handleProjectChange} />
              </div>
              <div className="admin-form-group">
                <label>Live URL</label>
                <input name="live_url" type="url" value={projectForm.live_url} onChange={handleProjectChange} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <div className="admin-form-group">
                <label>Main Thumbnail Image</label>
                <input id="thumbnail_input" type="file" accept="image/*" onChange={handleThumbnailChange} style={{ padding: "10px", background: "#fcfcfc" }} />
              </div>
              <div className="admin-form-group">
                <label>Display Order</label>
                <input name="display_order" type="number" value={projectForm.display_order} onChange={handleProjectChange} />
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "600" }}>
                <input type="checkbox" name="featured" checked={projectForm.featured} onChange={handleProjectChange} style={{ width: "18px", height: "18px" }} />
                <span>Featured Project (Shows up first)</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button type="submit" className="admin-login-button">
                {isEditingProject ? "Update Project" : "Add Project"}
              </button>
              {isEditingProject && (
                <button type="button" className="admin-logout-button" onClick={() => { setIsEditingProject(false); setProjectForm({ title: "", slug: "", short_description: "", full_description: "", technologiesText: "", featuresText: "", github_url: "", live_url: "", featured: false, display_order: 0 }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* PROJECTS LIST */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", padding: "30px", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            Existing Projects
          </h2>
          {projects.length > 0 ? (
            <div style={{ display: "grid", gap: "10px" }}>
              {projects.map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", background: "#fff", border: "1px solid #eee", borderRadius: "12px" }}>
                  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt="thumb" style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "50px", height: "50px", borderRadius: "8px", background: "#eee" }} />
                    )}
                    <div>
                      <strong style={{ fontSize: "16px", display: "block" }}>{p.title} {p.featured && "⭐"}</strong>
                      <span style={{ fontSize: "12px", color: "#777" }}>Slug: {p.slug} • Order: {p.display_order}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEditProject(p)} style={{ padding: "8px 15px", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDeleteProject(p.id)} style={{ padding: "8px 15px", background: "#fff0ed", color: "#a8321d", border: "none", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#777" }}>No projects found.</p>
          )}
        </section>


        {/* 2. PROJECT GALLERY UPLOAD SECTION */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            Add Image to Project Gallery
          </h2>
          
          <form onSubmit={handleGallerySubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Select Project</label>
                <select name="project" value={galleryForm.project} onChange={handleGalleryChange} required style={{ width: "100%", padding: "15px", border: "1px solid #dedede", borderRadius: "12px", background: "#fff" }}>
                  <option value="">-- Choose Project --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Image File</label>
                <input id="gallery_input" type="file" accept="image/*" onChange={handleGalleryFileChange} required style={{ padding: "10px", background: "#fcfcfc" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Image Caption (Optional)</label>
                <input name="caption" type="text" value={galleryForm.caption} onChange={handleGalleryChange} />
              </div>
              <div className="admin-form-group">
                <label>Display Order</label>
                <input name="display_order" type="number" value={galleryForm.display_order} onChange={handleGalleryChange} />
              </div>
            </div>

            <button type="submit" className="admin-login-button">
              Upload Gallery Image
            </button>
          </form>
        </section>

        {/* GALLERY IMAGES LIST */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", padding: "30px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            Gallery Images
          </h2>
          {projectImages.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" }}>
              {projectImages.map(img => {
                const parentProject = projects.find(p => p.id === img.project);
                return (
                  <div key={img.id} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid #eee" }}>
                    <img src={img.image} alt={img.caption} style={{ width: "100%", height: "150px", objectFit: "cover", display: "block" }} />
                    <div style={{ padding: "10px", background: "#fff", fontSize: "11px" }}>
                      <strong style={{ display: "block", marginBottom: "5px" }}>{parentProject ? parentProject.title : "Unknown Project"}</strong>
                      {img.caption && <span style={{ color: "#777", display: "block", marginBottom: "5px" }}>"{img.caption}"</span>}
                      
                      <button 
                        onClick={() => handleDeleteGalleryImage(img.id)} 
                        style={{ width: "100%", padding: "6px", background: "#fff0ed", color: "#a8321d", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "5px" }}
                      >
                        Delete Image
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "#777" }}>No gallery images uploaded yet.</p>
          )}
        </section>

      </div>
    </main>
  );
}

export default ProjectsManage;