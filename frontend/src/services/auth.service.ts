import { api } from "@/lib/api";
import type { User } from "@/types";

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nationalId?: string;
  dateOfBirth?: string;
  phone?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export const authService = {
  login: (data: LoginInput) => api.post<LoginResponse>("/auth/login", data),
  register: (data: RegisterInput) => api.post<User>("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  refresh: () => api.post<{ accessToken: string }>("/auth/refresh"),
  getMe: () => api.get<User>("/auth/me"),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }) => api.post("/auth/reset-password", data),
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => api.post("/auth/change-password", data),
  getSessions: () => api.get("/auth/sessions"),
  revokeSession: (id: string) => api.delete(`/auth/sessions/${id}`),
  logoutAll: () => api.post("/auth/logout-all"),
};
