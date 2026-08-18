import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Lock,
  Save,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Loader2,
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
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/services/auth.service";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase")
      .regex(/[a-z]/, "Must contain lowercase")
      .regex(/[0-9]/, "Must contain a number")
      .regex(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
        "Must contain special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export function ProfilePage() {
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
      toast.success("Password changed! Please log in again.");
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
      <PageHeader title="Profile" description="Manage your account settings" />

      {/* User Header Card */}
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
                  <Badge variant="success">Verified</Badge>
                ) : (
                  <Badge variant="warning">Unverified</Badge>
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
            Information
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="h-4 w-4" />
            Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoField icon={Mail} label="Email" value={user.email} />
              <InfoField
                icon={Phone}
                label="Phone"
                value={user.phone ?? "Not provided"}
              />
              <InfoField
                icon={CreditCard}
                label="National ID"
                value={user.nationalId ?? "Not provided"}
              />
              {user.dateOfBirth && (
                <InfoField
                  icon={Calendar}
                  label="Date of Birth"
                  value={format(new Date(user.dateOfBirth), "PP")}
                />
              )}
              <InfoField
                icon={Calendar}
                label="Member Since"
                value={format(new Date(user.createdAt), "PP")}
              />
              {user.lastLoginAt && (
                <InfoField
                  icon={Calendar}
                  label="Last Login"
                  value={format(new Date(user.lastLoginAt), "PPpp")}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit((d) => changePassword.mutate(d))}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    error={!!errors.currentPassword}
                    {...register("currentPassword")}
                  />
                  <FormMessage message={errors.currentPassword?.message} />
                </div>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    error={!!errors.newPassword}
                    {...register("newPassword")}
                  />
                  <FormMessage message={errors.newPassword?.message} />
                </div>

                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    error={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />
                  <FormMessage message={errors.confirmPassword?.message} />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="gradient"
                    loading={changePassword.isPending}
                  >
                    <Save className="h-4 w-4" />
                    Change Password
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
