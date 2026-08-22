import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  CreditCard,
  UserPlus,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { AuthLayout } from "../components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { PasswordStrength } from "@/components/shared/password-strength";
import { useRegister } from "@/hooks/use-auth";

const registerSchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    nationalId: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const register_ = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password") || "";

  return (
    <AuthLayout
      title={t("auth.createAccount")}
      subtitle={t("auth.createAccountSub")}
    >
      <form
        onSubmit={handleSubmit((data) => register_.mutate(data))}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700 dark:text-slate-200">
            {t("auth.fullName")}
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder={t("auth.fullNamePlaceholder")}
            icon={<User className="h-4 w-4" />}
            error={!!errors.name}
            {...register("name")}
          />
          <FormMessage message={errors.name?.message} />
        </div>

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

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-slate-700 dark:text-slate-200"
            >
              {t("auth.phone")}
            </Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder={t("auth.phonePlaceholder")}
              icon={<Phone className="h-4 w-4" />}
              error={!!errors.phone}
              {...register("phone")}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="nationalId"
              className="text-slate-700 dark:text-slate-200"
            >
              {t("auth.nationalId")}
            </Label>
            <Input
              id="nationalId"
              type="text"
              placeholder={t("auth.nationalIdPlaceholder")}
              icon={<CreditCard className="h-4 w-4" />}
              error={!!errors.nationalId}
              {...register("nationalId")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-slate-700 dark:text-slate-200"
          >
            {t("auth.password")}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
          <PasswordStrength password={password} />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-slate-700 dark:text-slate-200"
          >
            {t("auth.confirmPassword")}
          </Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={t("auth.passwordPlaceholder")}
            icon={<Lock className="h-4 w-4" />}
            error={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          <FormMessage message={errors.confirmPassword?.message} />
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full mt-6"
          loading={register_.isPending}
        >
          <UserPlus className="h-4 w-4" />
          {t("auth.register")}
          <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2">
          {t("auth.haveAccount")}{" "}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            {t("auth.signIn")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
