import axios from "axios";

export const registerUser = (user) =>
  axios.post("/api/register", user);

export const loginUser = (user) =>
  axios.post("/api/login", user);

export const uploadFile = (username, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`/api/upload/${username}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};