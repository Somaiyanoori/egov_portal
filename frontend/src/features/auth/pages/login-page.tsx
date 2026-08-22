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
  email: z.string().email(),
  password: z.string().min(1),
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
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  return (
    <AuthLayout title={t("auth.welcome")} subtitle={t("auth.welcomeSub")}>
      <form
        onSubmit={handleSubmit((data) => login.mutate(data))}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">
            {t("auth.email")}
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("auth.emailPlaceholder")}
            icon={<Mail className="h-4 w-4" />}
            error={!!errors.email}
            {...register("email")}
          />
          <FormMessage message={errors.email?.message} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-slate-700 dark:text-slate-200"
            >
              {t("auth.password")}
            </Label>
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
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
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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

        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={watch("rememberMe")}
            onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
          />
          <label
            htmlFor="rememberMe"
            className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none"
          >
            {t("auth.rememberMe")}
          </label>
        </div>

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

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white/80 dark:bg-transparent px-3 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t("common.or")}
            </span>
          </div>
        </div>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          {t("auth.noAccount")}{" "}
          <Link
            to="/register"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            {t("auth.signUp")}
          </Link>
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 rounded-lg bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
            {t("auth.demoAccounts")}:
          </p>
          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <div>Admin: admin@egov.com / Password123!</div>
            <div>Citizen: citizen@egov.com / Password123!</div>
          </div>
        </motion.div>
      </form>
    </AuthLayout>
  );
}
