import api from "./api";

// --- User Management ---
export const getAllUsers = async () => {
  try {
    const response = await api.get("/api/admin/users");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createUserByAdmin = async (userData) => {
  try {
    const response = await api.post("/api/admin/users", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// --- Department Management ---
export const getAllDepartments = async () => {
  try {
    const response = await api.get("/api/admin/departments");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getDepartmentById = async (id) => {
  try {
    const response = await api.get(`/api/admin/departments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createDepartment = async (departmentData) => {
  try {
    const response = await api.post("/api/admin/departments", departmentData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateDepartment = async (id, data) => {
  try {
    const response = await api.put(`/api/admin/departments/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteDepartment = async (departmentId) => {
  try {
    const response = await api.delete(`/api/admin/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// --- Service Management ---
export const createService = async (serviceData) => {
  try {
    const response = await api.post("/api/admin/services", serviceData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/api/admin/services/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const response = await api.put(`/api/admin/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/api/admin/services/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// --- Reports ---
export const getSystemReports = async () => {
  try {
    const response = await api.get("/api/admin/reports");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
