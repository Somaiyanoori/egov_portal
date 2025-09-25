import api from "./api";

export const getPendingRequests = async () => {
  try {
    const response = await api.get("/officer/requests/pending");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const processRequest = async (requestId, status) => {
  try {
    const response = await api.put(`/officer/requests/${requestId}/process`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getRequestDetails = async (requestId) => {
  try {
    const response = await api.get(`/officer/requests/${requestId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
