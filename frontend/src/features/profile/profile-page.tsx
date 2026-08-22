import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import {
  Lock,
  Save,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/shared/role-badge";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { getDateLocale } from "@/lib/i18n-helpers";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/services/auth.service";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("info");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const changePassword = useMutation({
    mutationFn: (data: any) => authService.changePassword(data),
    onSuccess: () => {
      toast.success(t("profile.passwordChanged"));
      reset();
      setTimeout(() => {
        logout();
        queryClient.clear();
        window.location.href = "/login";
      }, 1500);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
  });

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title={t("profile.title")}
        description={t("profile.manageAccount")}
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <RoleBadge role={user.role} />
                {user.isEmailVerified ? (
                  <Badge variant="success">{t("common.verified")}</Badge>
                ) : (
                  <Badge variant="warning">{t("common.unverified")}</Badge>
                )}
              </div>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
                {user.email}
              </p>
              {user.department && (
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  {user.department.name}
                  {user.jobTitle && ` • ${user.jobTitle}`}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="info">
            <Shield className="h-4 w-4" />
            {t("profile.information")}
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="h-4 w-4" />
            {t("auth.password")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.personalInfo")}</CardTitle>
              <CardDescription>
                {t("profile.yourAccountDetails")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoField
                icon={Mail}
                label={t("auth.email")}
                value={user.email}
              />
              <InfoField
                icon={Phone}
                label={t("auth.phone")}
                value={user.phone ?? t("common.notProvided")}
              />
              <InfoField
                icon={CreditCard}
                label={t("auth.nationalId")}
                value={user.nationalId ?? t("common.notProvided")}
              />
              {user.dateOfBirth && (
                <InfoField
                  icon={Calendar}
                  label={t("auth.dateOfBirth")}
                  value={format(new Date(user.dateOfBirth), "PP", {
                    locale: getDateLocale(),
                  })}
                />
              )}
              <InfoField
                icon={Calendar}
                label={t("profile.memberSince")}
                value={format(new Date(user.createdAt), "PP", {
                  locale: getDateLocale(),
                })}
              />
              {user.lastLoginAt && (
                <InfoField
                  icon={Calendar}
                  label={t("profile.lastLogin")}
                  value={format(new Date(user.lastLoginAt), "PPpp", {
                    locale: getDateLocale(),
                  })}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.changePassword")}</CardTitle>
              <CardDescription>
                {t("profile.changePasswordDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit((d) => changePassword.mutate(d))}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>{t("auth.currentPassword")}</Label>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    error={!!errors.currentPassword}
                    {...register("currentPassword")}
                  />
                  <FormMessage
                    message={errors.currentPassword?.message as string}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("auth.newPassword")}</Label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    error={!!errors.newPassword}
                    {...register("newPassword")}
                  />
                  <FormMessage
                    message={errors.newPassword?.message as string}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("auth.confirmPassword")}</Label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    error={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />
                  <FormMessage
                    message={errors.confirmPassword?.message as string}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="gradient"
                    loading={changePassword.isPending}
                  >
                    <Save className="h-4 w-4" />
                    {t("profile.changePassword")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-[color:var(--border)]">
      <div className="h-9 w-9 rounded-lg bg-[color:var(--accent)] flex items-center justify-center">
        <Icon className="h-4 w-4 text-[color:var(--muted-foreground)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[color:var(--muted-foreground)]">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
