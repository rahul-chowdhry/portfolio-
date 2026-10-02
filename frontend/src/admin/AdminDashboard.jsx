import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetMe, adminLogout } from "./adminApi";

const dashboardItems = [
  {
    title: "Profile",
    description: "Manage your personal information and professional profile.",
    icon: "01",
    path: "/admin/profile"
  },
  {
    title: "Services",
    description: "Manage services and service packages.",
    icon: "02",
    path: "/admin/services" // <-- Unlocked
  },
  {
    title: "Projects",
    description: "Add, edit and manage portfolio projects.",
    icon: "03",
    path: null
  },
  {
    title: "Skills",
    description: "Manage your technical and professional skills.",
    icon: "04",
    path: "/admin/skills"
  },
  {
    title: "Experience",
    description: "Manage your professional experience.",
    icon: "05",
    path: "/admin/experience"
  },
  {
    title: "Education",
    description: "Manage education and certifications.",
    icon: "06",
    path: "/admin/education"
  },
  {
    title: "Messages",
    description: "View messages received through the contact form.",
    icon: "07",
    path: "/admin/messages"
  },
  {
    title: "Social Links",
    description: "Manage your public social media links.",
    icon: "08",
    path: "/admin/social-links"
  },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tech_world_admin_token");

    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    const loadAdmin = async () => {
      try {
        const adminUser = await adminGetMe();
        setUser(adminUser);
      } catch {
        localStorage.removeItem("tech_world_admin_token");
        localStorage.removeItem("tech_world_admin_user");
        navigate("/admin/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin/login", { replace: true });
  };

  if (loading) {
    return (
      <main className="admin-loading-page">
        <div className="admin-loading-spinner" />
        <p>Loading admin panel...</p>
      </main>
    );
  }

  return (
    <main className="admin-dashboard-page">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-brand">
          <span className="admin-brand-mark">TW</span>
          <div>
            <p className="admin-brand-name">TECH WORLD</p>
            <span className="admin-brand-label">ADMIN PANEL</span>
          </div>
        </div>

        <div className="admin-header-actions">
          <div className="admin-user-info">
            <span className="admin-user-status" />
            <div>
              <strong>{user?.username || "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>

          <button
            className="admin-logout-button"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="admin-dashboard-content">
        <div className="admin-dashboard-intro">
          <div>
            <span className="admin-login-eyebrow">CONTROL CENTER</span>
            <h1>
              Welcome, <span>{user?.username || "Admin"}</span>
            </h1>
            <p>
              Manage your portfolio, services, projects and website content
              from one place.
            </p>
          </div>
          <div className="admin-dashboard-badge">
            <span className="admin-user-status" />
            System connected
          </div>
        </div>

        <div className="admin-dashboard-grid">
          {dashboardItems.map((item) => {
            const isActive = item.path !== null;

            return (
              <article className="admin-dashboard-card" key={item.title}>
                <div className="admin-card-top">
                  <span className="admin-card-number">{item.icon}</span>
                  <span className="admin-card-arrow">↗</span>
                </div>

                <h2>{item.title}</h2>
                <p>{item.description}</p>

                <button
                  type="button"
                  className="admin-card-action"
                  style={{ 
                    cursor: isActive ? "pointer" : "not-allowed",
                    color: isActive ? "#ef6c25" : "#aaa"
                  }}
                  disabled={!isActive}
                  title={isActive ? `Manage ${item.title}` : "Management module will be connected next"}
                  onClick={() => {
                    if (isActive) {
                      navigate(item.path);
                    }
                  }}
                >
                  {isActive ? `Manage ${item.title} →` : "Manage"}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;