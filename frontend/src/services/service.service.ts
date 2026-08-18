import { api } from "@/lib/api";
import type { Service } from "@/types";

export const serviceService = {
  getAllPublic: () => api.get<Service[]>("/services/all"),
  getById: (id: string) => api.get<Service>(`/services/${id}`),
};
