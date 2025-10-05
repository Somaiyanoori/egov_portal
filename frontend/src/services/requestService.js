// src/services/requestService.js
import api from "./api.js";

/**
 * Fetches all requests for the currently logged-in citizen.
 */
export const getMyRequests = async () => {
  try {
    const response = await api.get("/api/citizen/requests");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Creates a new service request.
 */
export const createRequest = async (formData) => {
  try {
    const response = await api.post("/citizen/requests/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Fetches all available services for the dropdown menu.
 */
export const getAllServices = async () => {
  try {
    const response = await api.get("/services");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Fetches details for a specific request by its ID.
 */
export const getRequestById = async (requestId) => {
  try {
    const response = await api.get(`/requests/${requestId}`);
    return response.data;
  } catch (error) {
    // مدیریت بهتر خطا با Optional Chaining
    throw error.response?.data || { message: error.message };
  }
};
