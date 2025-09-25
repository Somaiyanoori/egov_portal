// src/services/requestService.js
import api from "./api";

export const getMyRequests = async () => {
  try {
    const response = await api.get("/citizen/requests");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createRequest = async (formData) => {
  try {
    const response = await api.post("/citizen/requests/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllServices = async () => {
  try {
    const response = await api.get("/admin/services");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
