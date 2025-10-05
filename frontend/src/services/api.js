import axios from "axios";

const api = axios.create({
  baseURL: "https://egov-portal-backend.onrender.com", //live link.
  withCredentials: true,
});

export default api;
