import axios from "axios";

const API_BASE = "http://localhost:5000"; // Flask backend

export const registerUser = async (user) => {
  return axios.post(`${API_BASE}/register`, user);
};

export const loginUser = async (user) => {
  return axios.post(`${API_BASE}/login`, user);
};

export const uploadFile = async (username, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_BASE}/upload/${username}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};