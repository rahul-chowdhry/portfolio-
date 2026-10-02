import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API REQUEST ERROR:", {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      response: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export const getProfile = async () => {
  const response = await api.get("/profile/");
  return response.data;
};

export const getServices = async () => {
  const response = await api.get("/services/");
  return response.data;
};

export const getService = async (slug) => {
  const response = await api.get(`/services/${slug}/`);
  return response.data;
};

export const getSkills = async () => {
  const response = await api.get("/skills/");
  return response.data;
};

export const getProjects = async () => {
  const response = await api.get("/projects/");
  return response.data;
};

export const getProject = async (slug) => {
  const response = await api.get(`/projects/${slug}/`);
  return response.data;
};

export const getExperience = async () => {
  const response = await api.get("/experience/");
  return response.data;
};

export const getEducation = async () => {
  const response = await api.get("/education/");
  return response.data;
};

export const getSocialLinks = async () => {
  const response = await api.get("/social-links/");
  return response.data;
};

export const sendContactMessage = async (data) => {
  const response = await api.post("/contact/", data);
  return response.data;
};

export default api;