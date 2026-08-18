import { api } from "@/lib/api";
import type { User, Department, Service } from "@/types";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  nationalId?: string;
  departmentId?: string;
  jobTitle?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {}

export interface CreateDepartmentInput {
  name: string;
  nameFa?: string;
  description?: string;
  code?: string;
  isActive?: boolean;
}

export interface CreateServiceInput {
  name: string;
  nameFa?: string;
  description?: string;
  fee: number;
  processingDays: number;
  departmentId: string;
  isActive?: boolean;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
}

// Users
export const usersService = {
  list: (params?: ListParams) => api.get<User[]>("/users", params),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: CreateUserInput) => api.post<User>("/users", data),
  update: (id: string, data: UpdateUserInput) =>
    api.put<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  getStats: () => api.get<any>("/users/stats"),
};

// Departments
export const departmentsService = {
  list: (params?: ListParams) => api.get<Department[]>("/departments", params),
  getAll: () => api.get<Department[]>("/departments/all"),
  getById: (id: string) => api.get<Department>(`/departments/${id}`),
  create: (data: CreateDepartmentInput) =>
    api.post<Department>("/departments", data),
  update: (id: string, data: Partial<CreateDepartmentInput>) =>
    api.put<Department>(`/departments/${id}`, data),
  delete: (id: string) => api.delete(`/departments/${id}`),
};

// Services (admin)
export const servicesService = {
  list: (params?: ListParams) => api.get<Service[]>("/services", params),
  create: (data: CreateServiceInput) => api.post<Service>("/services", data),
  update: (id: string, data: Partial<CreateServiceInput>) =>
    api.put<Service>(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

// Reports
export const reportsService = {
  overview: () => api.get<any>("/reports/overview"),
  byDepartment: () => api.get<any>("/reports/requests-by-department"),
  revenueByDept: () => api.get<any>("/reports/revenue-by-department"),
  popularServices: (limit = 10) =>
    api.get<any>("/reports/popular-services", { limit }),
  timeSeries: (days = 30) =>
    api.get<any>("/reports/requests-timeseries", { days }),
  userGrowth: (days = 30) => api.get<any>("/reports/user-growth", { days }),
  exportCsv: () =>
    api.getInstance().get("/reports/export/requests", { responseType: "blob" }),
};
