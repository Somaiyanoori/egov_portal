import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { AuthLayout } from "../components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { authService } from "@/services/auth.service";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (!token) {
        throw new Error("Password reset token is missing");
      }

      return authService.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
    },
    onSuccess: () => {
      setSuccess(true);
      toast.success("Password reset successfully");
    },
    onError: () => {
      toast.error(
        "Unable to reset password. The link may be invalid or expired.",
      );
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your account"
    >
      {!token ? (
        <div className="text-center space-y-4">
          <p className="text-sm text-red-500">
            Invalid password reset link. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="text-sm text-[color:var(--primary)] hover:opacity-80"
          >
            Request a new reset link
          </Link>
        </div>
      ) : success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 py-4"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>

          <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
            Password reset successfully!
          </h3>

          <p className="text-sm text-[color:var(--muted-foreground)]">
            You can now sign in using your new password.
          </p>

          <Button
            type="button"
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              icon={<Lock className="h-4 w-4" />}
              {...register("password")}
              error={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-[color:var(--muted-foreground)]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 inline mr-1" />
              ) : (
                <Eye className="h-4 w-4 inline mr-1" />
              )}
              {showPassword ? "Hide password" : "Show password"}
            </button>
            <FormMessage message={errors.password?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              icon={<Lock className="h-4 w-4" />}
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-xs text-[color:var(--muted-foreground)]"
            >
              {showConfirmPassword ? "Hide password" : "Show password"}
            </button>
            <FormMessage message={errors.confirmPassword?.message} />
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            loading={mutation.isPending}
          >
            Reset Password
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] pt-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </motion.form>
      )}
    </AuthLayout>
  );
}
