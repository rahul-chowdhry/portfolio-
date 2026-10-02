import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "./adminApi";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.username.trim() || !formData.password) {
      setError("Username and password are required.");
      return;
    }

    try {
      setLoading(true);

      const data = await adminLogin(
        formData.username.trim(),
        formData.password
      );

      localStorage.setItem("tech_world_admin_token", data.token);
      localStorage.setItem(
        "tech_world_admin_user",
        JSON.stringify(data.user)
      );

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to login. Please check your username and password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-background">
        <div className="admin-auth-shape admin-auth-shape-one" />
        <div className="admin-auth-shape admin-auth-shape-two" />
      </div>

      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-brand-mark">TW</span>

          <div>
            <p className="admin-brand-name">TECH WORLD</p>
            <span className="admin-brand-label">ADMIN PANEL</span>
          </div>
        </div>

        <div className="admin-login-heading">
          <span className="admin-login-eyebrow">SECURE ACCESS</span>

          <h1>Welcome back</h1>

          <p>
            Sign in to manage your TECH WORLD portfolio and website content.
          </p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="admin-username">Username</label>

            <input
              id="admin-username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Password</label>

            <input
              id="admin-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="admin-login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in to Admin Panel"}
          </button>
        </form>

        <div className="admin-login-footer">
          <span>TECH WORLD</span>
          <span>Secure administrator access</span>
        </div>
      </section>
    </main>
  );
}

export default AdminLogin;