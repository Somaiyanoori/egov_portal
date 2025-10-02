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

export const updateDepartment = async (departmentId, departmentData) => {
  try {
    // Note: The backend route for update and delete doesn't exist yet. We'll add it.
    const response = await api.put(
      `/admin/departments/${departmentId}`,
      departmentData
    );
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
