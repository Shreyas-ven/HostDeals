import axios from "axios";

const BASE_URL = "https://hostdeals-backend.onrender.com";

// ✅ AXIOS INSTANCE
const api = axios.create({
  baseURL: BASE_URL,
});

// ==========================
// AUTH
// ==========================
export const registerUser = (user) =>
  api.post("/api/register", user);

export const loginUser = (user) =>
  api.post("/api/login", user);

// ==========================
// CONTACT
// ==========================
export const sendContact = (data) =>
  api.post("/api/contact", data);

// ==========================
// GITHUB
// ==========================
export const saveGithub = (data) =>
  api.post("/api/save-github", data);

export const getGithub = (email) =>
  api.get(`/api/get-github?email=${email}`);

export const deleteGithub = (data) =>
  api.post("/api/delete-github", data);

export const getRepos = (email) =>
  api.get(`/api/get-repos?email=${email}`);

// ==========================
// PROFILE
// ==========================
export const getProfile = (email) =>
  api.get(`/api/get-profile?email=${email}`);

// ==========================
// SITES
// ==========================
export const getSites = (email) =>
  api.get(`/api/my-sites?email=${email}`);

export const startSite = (data) =>
  api.post("/api/start-site", data);

export const stopSite = (data) =>
  api.post("/api/stop-site", data);

export const deleteSite = (data) =>
  api.post("/api/delete-site", data);

// ==========================
// UPLOAD
// ==========================
export const uploadSite = (formData) =>
  api.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });