import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
  adminGetPackages,
  adminCreatePackage,
  adminUpdatePackage,
  adminDeletePackage,
} from "./adminApi";

function ServicesManage() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Service Form State
  const [serviceForm, setServiceForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    display_order: 0,
    is_active: true,
  });
  const [isEditingService, setIsEditingService] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);

  // Package Form State
  const [packageForm, setPackageForm] = useState({
    service: "",
    name: "",
    short_description: "",
    price: "",
    price_label: "",
    featuresText: "", // comma separated for easy input
    display_order: 0,
    is_featured: false,
    is_active: true,
  });
  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [editPackageId, setEditPackageId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesData, packagesData] = await Promise.all([
        adminGetServices(),
        adminGetPackages(),
      ]);
      setServices(servicesData);
      setPackages(packagesData);
    } catch (err) {
      setError("Unable to load services data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- SERVICE HANDLERS ---
  const handleServiceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug from name if creating new service
    if (name === "name" && !isEditingService) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setServiceForm((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (isEditingService) {
        await adminUpdateService(editServiceId, serviceForm);
        setMessage("Service updated successfully.");
      } else {
        await adminCreateService(serviceForm);
        setMessage("Service created successfully.");
      }
      setIsEditingService(false);
      setEditServiceId(null);
      setServiceForm({ name: "", slug: "", description: "", icon: "", display_order: 0, is_active: true });
      fetchData();
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save service.");
    }
  };

  const handleEditService = (service) => {
    setIsEditingService(true);
    setEditServiceId(service.id);
    setServiceForm({
      name: service.name,
      slug: service.slug,
      description: service.description,
      icon: service.icon || "",
      display_order: service.display_order,
      is_active: service.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure? Deleting service will delete its packages too.")) return;
    try {
      await adminDeleteService(id);
      setMessage("Service deleted.");
      fetchData();
    } catch (err) {
      setError("Failed to delete service.");
    }
  };

  // --- PACKAGE HANDLERS ---
  const handlePackageChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPackageForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // Convert featuresText comma separated string into Array
      const featuresArray = packageForm.featuresText
        ? packageForm.featuresText.split(",").map((f) => f.trim()).filter(Boolean)
        : [];

      const payload = {
        ...packageForm,
        service: Number(packageForm.service),
        price: packageForm.price ? Number(packageForm.price) : null,
        features: featuresArray,
      };
      delete payload.featuresText;

      if (isEditingPackage) {
        await adminUpdatePackage(editPackageId, payload);
        setMessage("Package updated successfully.");
      } else {
        await adminCreatePackage(payload);
        setMessage("Package created successfully.");
      }
      setIsEditingPackage(false);
      setEditPackageId(null);
      setPackageForm({
        service: "", name: "", short_description: "", price: "", price_label: "",
        featuresText: "", display_order: 0, is_featured: false, is_active: true,
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save package.");
    }
  };

  const handleEditPackage = (pkg) => {
    setIsEditingPackage(true);
    setEditPackageId(pkg.id);
    setPackageForm({
      service: pkg.service,
      name: pkg.name,
      short_description: pkg.short_description || "",
      price: pkg.price !== null ? pkg.price : "",
      price_label: pkg.price_label || "",
      featuresText: Array.isArray(pkg.features) ? pkg.features.join(", ") : "",
      display_order: pkg.display_order,
      is_featured: pkg.is_featured,
      is_active: pkg.is_active,
    });
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await adminDeletePackage(id);
      setMessage("Package deleted.");
      fetchData();
    } catch (err) {
      setError("Failed to delete package.");
    }
  };

  if (loading && services.length === 0) {
    return (
      <main className="admin-loading-page">
        <div className="admin-loading-spinner" />
        <p>Loading services...</p>
      </main>
    );
  }

  return (
    <main className="admin-manage-page" style={{ padding: "40px 20px", background: "#f7f7f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        <header className="admin-manage-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <span className="admin-login-eyebrow">SERVICES & PACKAGES</span>
            <h1 style={{ fontSize: "32px", margin: "10px 0" }}>Manage Services</h1>
            <p style={{ color: "#777", margin: 0 }}>Create and manage service categories and pricing packages.</p>
          </div>
          <button type="button" className="admin-logout-button" onClick={() => navigate("/admin/dashboard")}>
            ← Back to Dashboard
          </button>
        </header>

        {message && <div className="form-success" style={{ padding: "15px", background: "#e8f7ed", color: "#21663b", borderRadius: "10px", marginBottom: "25px" }}>{message}</div>}
        {error && <div className="admin-login-error" style={{ marginBottom: "25px" }}>{error}</div>}

        {/* 1. SERVICE FORM SECTION */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            {isEditingService ? "Edit Service" : "Add New Service"}
          </h2>
          
          <form onSubmit={handleServiceSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Service Name</label>
                <input name="name" type="text" value={serviceForm.name} onChange={handleServiceChange} placeholder="e.g. Web Development" required />
              </div>
              <div className="admin-form-group">
                <label>Slug (URL friendly)</label>
                <input name="slug" type="text" value={serviceForm.slug} onChange={handleServiceChange} placeholder="web-development" required />
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: "20px" }}>
              <label>Description</label>
              <textarea name="description" value={serviceForm.description} onChange={handleServiceChange} rows="3" style={{ width: "100%", padding: "15px", border: "1px solid #dedede", borderRadius: "12px", fontFamily: "inherit" }} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Icon (Optional)</label>
                <input name="icon" type="text" value={serviceForm.icon} onChange={handleIconChange => serviceForm.icon} onChange={handleServiceChange} placeholder="e.g. code" />
              </div>
              <div className="admin-form-group">
                <label>Display Order</label>
                <input name="display_order" type="number" value={serviceForm.display_order} onChange={handleServiceChange} />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "600" }}>
                <input type="checkbox" name="is_active" checked={serviceForm.is_active} onChange={handleServiceChange} style={{ width: "18px", height: "18px" }} />
                <span>Active (Visible on public website)</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button type="submit" className="admin-login-button">
                {isEditingService ? "Update Service" : "Add Service"}
              </button>
              {isEditingService && (
                <button type="button" className="admin-logout-button" onClick={() => { setIsEditingService(false); setServiceForm({ name: "", slug: "", description: "", icon: "", display_order: 0, is_active: true }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* SERVICES LIST */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", padding: "30px", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            Existing Services
          </h2>
          {services.length > 0 ? (
            <div style={{ display: "grid", gap: "10px" }}>
              {services.map(s => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", background: "#fff", border: "1px solid #eee", borderRadius: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "16px", display: "block" }}>{s.name}</strong>
                    <span style={{ fontSize: "12px", color: "#777" }}>Slug: {s.slug} • Order: {s.display_order}</span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEditService(s)} style={{ padding: "8px 15px", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDeleteService(s.id)} style={{ padding: "8px 15px", background: "#fff0ed", color: "#a8321d", border: "none", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#777" }}>No services found.</p>
          )}
        </section>


        {/* 2. SERVICE PACKAGE FORM SECTION */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            {isEditingPackage ? "Edit Service Package" : "Add New Service Package"}
          </h2>
          
          <form onSubmit={handlePackageSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Select Service</label>
                <select name="service" value={packageForm.service} onChange={handlePackageChange} required style={{ width: "100%", padding: "15px", border: "1px solid #dedede", borderRadius: "12px", background: "#fff" }}>
                  <option value="">-- Choose Service --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Package Name</label>
                <input name="name" type="text" value={packageForm.name} onChange={handlePackageChange} placeholder="e.g. Standard Web Package" required />
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: "20px" }}>
              <label>Short Description</label>
              <input name="short_description" type="text" value={packageForm.short_description} onChange={handlePackageChange} placeholder="Brief summary of package" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Price (₹)</label>
                <input name="price" type="number" step="0.01" value={packageForm.price} onChange={handlePackageChange} placeholder="5000" />
              </div>
              <div className="admin-form-group">
                <label>Price Label (Optional)</label>
                <input name="price_label" type="text" value={packageForm.price_label} onChange={handlePackageChange} placeholder="e.g. Starting from / Fixed" />
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: "20px" }}>
              <label>Features (Comma separated)</label>
              <input name="featuresText" type="text" value={packageForm.featuresText} onChange={handlePackageChange} placeholder="Responsive design, SEO ready, Fast speed" />
              <small style={{ color: "#777", marginTop: "5px", display: "block" }}>Separate each feature with a comma (,)</small>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label>Display Order</label>
                <input name="display_order" type="number" value={packageForm.display_order} onChange={handlePackageChange} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "30px", marginBottom: "25px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "600" }}>
                <input type="checkbox" name="is_featured" checked={packageForm.is_featured} onChange={handlePackageChange} style={{ width: "18px", height: "18px" }} />
                <span>Featured Package</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "600" }}>
                <input type="checkbox" name="is_active" checked={packageForm.is_active} onChange={handlePackageChange} style={{ width: "18px", height: "18px" }} />
                <span>Active</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button type="submit" className="admin-login-button">
                {isEditingPackage ? "Update Package" : "Add Package"}
              </button>
              {isEditingPackage && (
                <button type="button" className="admin-logout-button" onClick={() => { setIsEditingPackage(false); setPackageForm({ service: "", name: "", short_description: "", price: "", price_label: "", featuresText: "", display_order: 0, is_featured: false, is_active: true }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* PACKAGES LIST */}
        <section className="admin-login-card" style={{ width: "100%", maxWidth: "100%", padding: "30px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            Existing Packages
          </h2>
          {packages.length > 0 ? (
            <div style={{ display: "grid", gap: "10px" }}>
              {packages.map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", background: "#fff", border: "1px solid #eee", borderRadius: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "16px", display: "block" }}>{p.name} {p.is_featured && "⭐ (Featured)"}</strong>
                    <span style={{ fontSize: "12px", color: "#777" }}>Price: ₹{p.price || 0} • Order: {p.display_order}</span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEditPackage(p)} style={{ padding: "8px 15px", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDeletePackage(p.id)} style={{ padding: "8px 15px", background: "#fff0ed", color: "#a8321d", border: "none", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#777" }}>No packages found.</p>
          )}
        </section>

      </div>
    </main>
  );
}

export default ServicesManage;