import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  requestService,
  type ListRequestsParams,
} from "@/services/request.service";

export function useRequests(params?: ListRequestsParams) {
  return useQuery({
    queryKey: ["requests", params],
    queryFn: () => requestService.list(params),
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: ["requests", id],
    queryFn: () => requestService.getById(id),
    enabled: !!id,
  });
}

export function useMyRequestStats() {
  return useQuery({
    queryKey: ["requests", "my-stats"],
    queryFn: () => requestService.getMyStats(),
  });
}

export function useCreateRequest() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => requestService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request submitted successfully!", {
        description: `Tracking: ${response.data?.trackingNumber}`,
      });
      navigate(`/app/requests/${response.data?.id}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit request");
    },
  });
}

export function useProcessRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      status: string;
      rejectionReason?: string;
    }) => requestService.process(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success(
        `Request ${variables.status.toLowerCase().replace("_", " ")}`,
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to process request",
      );
    },
  });
}

export function useCancelRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => requestService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to cancel request");
    },
  });
}
