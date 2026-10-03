import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ==========================================
// AUTHENTICATION
// ==========================================
export const adminLogin = async (username, password) => {
  const response = await adminApi.post("/admin/login/", { username, password });
  return response.data;
};

export const adminGetMe = async () => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.get("/admin/me/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminLogout = async () => {
  const token = localStorage.getItem("tech_world_admin_token");
  try {
    await adminApi.post("/admin/logout/", {}, {
      headers: { Authorization: `Token ${token}` },
    });
  } finally {
    localStorage.removeItem("tech_world_admin_token");
    localStorage.removeItem("tech_world_admin_user");
  }
};

// ==========================================
// PROFILE MANAGEMENT
// ==========================================
export const adminGetProfile = async () => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.get("/admin/profile/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminUpdateProfile = async (profileData) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const config = { headers: { Authorization: `Token ${token}` } };
  if (profileData instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  const response = await adminApi.patch("/admin/profile/", profileData, config);
  return response.data;
};

// ==========================================
// SKILLS MANAGEMENT
// ==========================================
export const adminGetSkills = async () => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.get("/admin/skills/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminCreateSkill = async (skillData) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.post("/admin/skills/", skillData, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminUpdateSkill = async (id, skillData) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.patch(`/admin/skills/${id}/`, skillData, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminDeleteSkill = async (id) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.delete(`/admin/skills/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// ==========================================
// EXPERIENCE MANAGEMENT
// ==========================================
export const adminGetExperience = async () => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.get("/admin/experience/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminCreateExperience = async (data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.post("/admin/experience/", data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminUpdateExperience = async (id, data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.patch(`/admin/experience/${id}/`, data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminDeleteExperience = async (id) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.delete(`/admin/experience/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// ==========================================
// EDUCATION MANAGEMENT
// ==========================================
export const adminGetEducation = async () => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.get("/admin/education/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminCreateEducation = async (data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.post("/admin/education/", data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminUpdateEducation = async (id, data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.patch(`/admin/education/${id}/`, data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminDeleteEducation = async (id) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.delete(`/admin/education/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// ==========================================
// SOCIAL LINKS MANAGEMENT
// ==========================================
export const adminGetSocialLinks = async () => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.get("/admin/social-links/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminCreateSocialLink = async (data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.post("/admin/social-links/", data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminUpdateSocialLink = async (id, data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.patch(`/admin/social-links/${id}/`, data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminDeleteSocialLink = async (id) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.delete(`/admin/social-links/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// ==========================================
// CONTACT MESSAGES MANAGEMENT
// ==========================================
export const adminGetMessages = async () => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.get("/admin/messages/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminUpdateMessage = async (id, data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.patch(`/admin/messages/${id}/`, data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminDeleteMessage = async (id) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.delete(`/admin/messages/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// ==========================================
// SERVICES & PACKAGES MANAGEMENT
// ==========================================
export const adminGetServices = async () => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.get("/admin/services/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminCreateService = async (data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.post("/admin/services/", data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminUpdateService = async (id, data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.patch(`/admin/services/${id}/`, data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminDeleteService = async (id) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.delete(`/admin/services/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminGetPackages = async () => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.get("/admin/packages/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminCreatePackage = async (data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.post("/admin/packages/", data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminUpdatePackage = async (id, data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.patch(`/admin/packages/${id}/`, data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminDeletePackage = async (id) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.delete(`/admin/packages/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// ==========================================
// PROJECTS & GALLERY MANAGEMENT
// ==========================================
export const adminGetProjects = async () => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.get("/admin/projects/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminCreateProject = async (data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const config = { headers: { Authorization: `Token ${token}` } };
  if (data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  const response = await adminApi.post("/admin/projects/", data, config);
  return response.data;
};

export const adminUpdateProject = async (id, data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const config = { headers: { Authorization: `Token ${token}` } };
  if (data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  const response = await adminApi.patch(`/admin/projects/${id}/`, data, config);
  return response.data;
};

export const adminDeleteProject = async (id) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.delete(`/admin/projects/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// Project Images (Gallery)
export const adminGetProjectImages = async () => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.get("/admin/project-images/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const adminCreateProjectImage = async (data) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const config = { headers: { Authorization: `Token ${token}` } };
  if (data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  const response = await adminApi.post("/admin/project-images/", data, config);
  return response.data;
};

export const adminDeleteProjectImage = async (id) => {
  const token = localStorage.getItem("tech_world_admin_token");
  const response = await adminApi.delete(`/admin/project-images/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export default adminApi;