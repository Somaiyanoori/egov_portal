import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  usersService,
  departmentsService,
  servicesService,
  reportsService,
  type CreateUserInput,
  type UpdateUserInput,
  type CreateDepartmentInput,
  type CreateServiceInput,
  type ListParams,
} from "@/services/admin.service";

// Users
export function useUsers(params?: ListParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => usersService.list(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserInput) => usersService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateUserInput & { id: string }) =>
      usersService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
  });
}

// Departments
export function useDepartments(params?: ListParams) {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => departmentsService.list(params),
  });
}

export function useAllDepartments() {
  return useQuery({
    queryKey: ["departments", "all"],
    queryFn: () => departmentsService.getAll(),
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDepartmentInput) =>
      departmentsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department created successfully");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: Partial<CreateDepartmentInput> & { id: string }) =>
      departmentsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department updated successfully");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted successfully");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
  });
}

// Services
export function useAdminServices(params?: ListParams) {
  return useQuery({
    queryKey: ["services", "admin", params],
    queryFn: () => servicesService.list(params),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServiceInput) => servicesService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service created successfully");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: Partial<CreateServiceInput> & { id: string }) =>
      servicesService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service updated successfully");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted successfully");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
  });
}

// Reports
export function useReportsOverview() {
  return useQuery({
    queryKey: ["reports", "overview"],
    queryFn: () => reportsService.overview(),
  });
}

export function useReportsByDepartment() {
  return useQuery({
    queryKey: ["reports", "by-department"],
    queryFn: () => reportsService.byDepartment(),
  });
}

export function useReportsRevenueByDept() {
  return useQuery({
    queryKey: ["reports", "revenue-by-department"],
    queryFn: () => reportsService.revenueByDept(),
  });
}

export function useReportsPopularServices(limit = 10) {
  return useQuery({
    queryKey: ["reports", "popular-services", limit],
    queryFn: () => reportsService.popularServices(limit),
  });
}

export function useReportsTimeSeries(days = 30) {
  return useQuery({
    queryKey: ["reports", "time-series", days],
    queryFn: () => reportsService.timeSeries(days),
  });
}
