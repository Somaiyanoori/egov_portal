import { useQuery } from "@tanstack/react-query";
import { serviceService } from "@/services/service.service";

export function usePublicServices() {
  return useQuery({
    queryKey: ["services", "public"],
    queryFn: () => serviceService.getAllPublic(),
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ["services", id],
    queryFn: () => serviceService.getById(id),
    enabled: !!id,
  });
}
