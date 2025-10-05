import api from "./api";

export const login = async (email, password) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
