// src/services/officerService.js
import api from "./api";

export const getPendingRequests = async () => {
  try {
    const response = await api.get("/api/officer/requests/pending");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const processRequest = async (requestId, status) => {
  try {
    const response = await api.put(
      `/api/officer/requests/${requestId}/process`,
      {
        status,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getRequestDetails = async (requestId) => {
  try {
    const response = await api.get(`/api/officer/requests/${requestId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const searchRequests = async (params) => {
  try {
    const response = await api.get("/api/officer/requests", { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
