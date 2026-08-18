import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { AuthLayout } from "../components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage } from "@/components/ui/form-message";
import { useLogin } from "@/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  return (
    <AuthLayout title={t("auth.welcome")} subtitle={t("auth.welcomeSub")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/90">
            {t("auth.email")}
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("auth.emailPlaceholder")}
            icon={<Mail className="h-4 w-4" />}
            error={!!errors.email}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-brand-400"
            {...register("email")}
          />
          <FormMessage message={errors.email?.message} />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white/90">
              {t("auth.password")}
            </Label>
            <Link
              to="/forgot-password"
              className="text-xs text-brand-300 hover:text-brand-200 transition-colors"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={t("auth.passwordPlaceholder")}
              icon={<Lock className="h-4 w-4" />}
              error={!!errors.password}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-brand-400 pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <FormMessage message={errors.password?.message} />
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={watch("rememberMe")}
            onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
            className="border-white/30 data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm text-white/80 cursor-pointer select-none"
          >
            {t("auth.rememberMe")}
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          loading={login.isPending}
        >
          <LogIn className="h-4 w-4" />
          {t("auth.signIn")}
          <ArrowRight className="h-4 w-4" />
        </Button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-transparent px-3 text-xs text-white/40 uppercase tracking-wider">
              or
            </span>
          </div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-white/70">
          {t("auth.noAccount")}{" "}
          <Link
            to="/register"
            className="text-brand-300 hover:text-brand-200 font-medium transition-colors"
          >
            {t("auth.signUp")}
          </Link>
        </p>

        {/* Demo credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-3 rounded-lg bg-white/5 border border-white/10"
        >
          <p className="text-xs text-white/50 mb-2 font-medium">
            Demo Accounts:
          </p>
          <div className="space-y-1 text-xs text-white/60">
            <div>Admin: admin@egov.com / Password123!</div>
            <div>Citizen: citizen@egov.com / Password123!</div>
          </div>
        </motion.div>
      </form>
    </AuthLayout>
  );
}
