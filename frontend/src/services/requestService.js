// src/services/requestService.js
import api from "./api.js";

export const getMyRequests = async () => {
  try {
    const response = await api.get("/api/citizen/requests");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const createRequest = async (formData) => {
  try {
    const response = await api.post("/api/citizen/requests/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getAllServices = async () => {
  try {
    const response = await api.get("/api/services");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getRequestById = async (requestId) => {
  try {
    const response = await api.get(`/api/requests/${requestId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
