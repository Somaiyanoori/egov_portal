import api from "./api";

export const getAllUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserById = async (userId) => {
  try {
    // We'll create this endpoint in the backend next if it doesn't exist.
    // For now, let's assume an admin can fetch any user's details.
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllDepartments = async () => {
  try {
    const response = await api.get("/admin/departments");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const createDepartment = async (departmentData) => {
  try {
    const response = await api.post("/admin/departments", departmentData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateDepartment = async (id, data) => {
  try {
    const response = await api.put(`/admin/departments/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteDepartment = async (departmentId) => {
  try {
    const response = await api.delete(`/admin/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getSystemReports = async () => {
  try {
    const response = await api.get("/admin/reports");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const createUserByAdmin = async (userData) => {
  try {
    const response = await api.post("/admin/users", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getDepartmentById = async (id) => {
  try {
    const response = await api.get(`/admin/departments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const updateService = async (id, serviceData) => {
  try {
    const response = await api.put(`/admin/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/admin/services/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/admin/services/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const createService = async (serviceData) => {
  try {
    const response = await api.post("/admin/services", serviceData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
