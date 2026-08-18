import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  authService,
  type LoginInput,
  type RegisterInput,
} from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

export function useCurrentUser() {
  const { setUser, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await authService.getMe();
      setUser(response.data!);
      return response.data!;
    },
    enabled: isAuthenticated,
    retry: false,
  });
}

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (response) => {
      setUser(response.data!.user);
      queryClient.setQueryData(["auth", "me"], response.data!.user);
      toast.success(t("auth.loginSuccess"));
      navigate("/app/dashboard");
    },
    onError: () => {
      toast.error(t("auth.loginError"));
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: () => {
      toast.success(t("auth.registerSuccess"));
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Registration failed");
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logout();
      queryClient.clear();
      toast.success(t("auth.logoutSuccess"));
      navigate("/login");
    },
  });
}
