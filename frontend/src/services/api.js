import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3012/api",
  withCredentials: true,
});

export default api;
