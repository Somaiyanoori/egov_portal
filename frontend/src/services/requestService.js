// src/services/requestService.js
import api from "./api";

// ... (getMyRequests, createRequest)

/**
 * Fetches all available services from the admin/services endpoint.
 */
export const getAllServices = async () => {
  try {
    // We use the admin endpoint because it provides a full list of services.
    // In a real-world scenario, you might create a dedicated public endpoint.
    const response = await api.get("/admin/services");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
