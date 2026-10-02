import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetProfile, adminUpdateProfile } from "./adminApi";

function ProfileManage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "",
    location: "",
    email: "",
    availability: true,
    profile_image: null,
    resume: null,
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await adminGetProfile();

        setProfile({
          name: data.name || "",
          title: data.title || "",
          bio: data.bio || "",
          location: data.location || "",
          email: data.email || "",
          availability: Boolean(data.availability),
          profile_image: data.profile_image || null,
          resume: data.resume || null,
        });
      } catch (err) {
        const detail =
          err.response?.data?.detail ||
          "Unable to load profile information.";

        setError(detail);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (files.length > 0) {
      if (name === "profile_image") {
        setProfileImageFile(files[0]);
      } else if (name === "resume") {
        setResumeFile(files[0]);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("title", profile.title);
      formData.append("bio", profile.bio);
      formData.append("location", profile.location);
      formData.append("email", profile.email);
      formData.append("availability", profile.availability);

      // Agar nayi file select ki gayi hai, tabhi usko form me add karo
      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const updatedProfile = await adminUpdateProfile(formData);

      setProfile({
        name: updatedProfile.name || "",
        title: updatedProfile.title || "",
        bio: updatedProfile.bio || "",
        location: updatedProfile.location || "",
        email: updatedProfile.email || "",
        availability: Boolean(updatedProfile.availability),
        profile_image: updatedProfile.profile_image || null,
        resume: updatedProfile.resume || null,
      });

      // Files upload hone ke baad file selectors ko clear kar do
      setProfileImageFile(null);
      setResumeFile(null);
      document.getElementById("profile_image_input").value = "";
      document.getElementById("resume_input").value = "";

      setMessage("Profile updated successfully.");
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        "Unable to update profile.";

      setError(detail);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-loading-page">
        <div className="admin-loading-spinner" />
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="admin-manage-page" style={{ padding: "40px 20px", background: "#f7f7f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <header className="admin-manage-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <span className="admin-login-eyebrow">
              PROFILE MANAGEMENT
            </span>
            <h1 style={{ fontSize: "32px", margin: "10px 0", letterSpacing: "-0.03em" }}>Manage Profile</h1>
            <p style={{ color: "#777", margin: 0 }}>
              Update the information displayed on your TECH WORLD portfolio.
            </p>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>
        </header>

        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%" }}>
          <form className="admin-profile-form" onSubmit={handleSubmit}>
            
            <div className="admin-form-group" style={{ marginBottom: "20px" }}>
              <label htmlFor="profile-name">Name</label>
              <input
                id="profile-name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="admin-form-group" style={{ marginBottom: "20px" }}>
              <label htmlFor="profile-title">Professional Title</label>
              <input
                id="profile-title"
                name="title"
                type="text"
                value={profile.title}
                onChange={handleChange}
                placeholder="Your professional title (e.g. Full-Stack Developer)"
                required
              />
            </div>

            <div className="admin-form-group" style={{ marginBottom: "20px" }}>
              <label htmlFor="profile-bio">Bio</label>
              <textarea
                id="profile-bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Write your professional bio"
                rows="5"
                style={{
                  width: "100%", padding: "15px", border: "1px solid #dedede", 
                  borderRadius: "12px", fontFamily: "inherit", resize: "vertical"
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label htmlFor="profile-location">Location</label>
                <input
                  id="profile-location"
                  name="location"
                  type="text"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="Your location"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="profile-email">Public Email</label>
                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
              
              <div className="admin-form-group">
                <label htmlFor="profile_image_input">Profile Image</label>
                {profile.profile_image && (
                  <div style={{ marginBottom: "8px", fontSize: "12px" }}>
                    <a href={profile.profile_image} target="_blank" rel="noreferrer" style={{ color: "#ef6c25" }}>View Current Image ↗</a>
                  </div>
                )}
                <input
                  id="profile_image_input"
                  name="profile_image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ padding: "10px", background: "#fcfcfc" }}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="resume_input">Resume (PDF)</label>
                {profile.resume && (
                  <div style={{ marginBottom: "8px", fontSize: "12px" }}>
                    <a href={profile.resume} target="_blank" rel="noreferrer" style={{ color: "#ef6c25" }}>View Current Resume ↗</a>
                  </div>
                )}
                <input
                  id="resume_input"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ padding: "10px", background: "#fcfcfc" }}
                />
              </div>

            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                <input
                  type="checkbox"
                  name="availability"
                  checked={profile.availability}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <span>Available for work / Open to new projects</span>
              </label>
            </div>

            {message && (
              <div className="form-success" role="status" style={{ padding: "15px", background: "#e8f7ed", color: "#21663b", borderRadius: "10px", marginBottom: "20px" }}>
                {message}
              </div>
            )}

            {error && (
              <div className="admin-login-error" role="alert" style={{ marginBottom: "20px" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="admin-login-button"
                style={{ padding: "0 30px" }}
                disabled={saving}
              >
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default ProfileManage;