import { api } from "@/lib/api";
import type { RequestModel, RequestStats, PaginationMeta } from "@/types";

export interface ListRequestsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  serviceId?: string;
  citizenId?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const requestService = {
  list: (params?: ListRequestsParams) =>
    api.get<RequestModel[]>("/requests", params),

  getById: (id: string) => api.get<RequestModel>(`/requests/${id}`),

  create: (data: FormData) => {
    return api.post<RequestModel>("/requests", data);
  },

  process: (id: string, data: { status: string; rejectionReason?: string }) =>
    api.put<RequestModel>(`/requests/${id}/process`, data),

  cancel: (id: string) => api.put<RequestModel>(`/requests/${id}/cancel`),

  getMyStats: () => api.get<RequestStats>("/requests/my/stats"),
};

export type { PaginationMeta };
