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
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
        "Must contain special character",
      ),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    nationalId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
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

  const onSubmit = (data: RegisterFormData) => {
    register_.mutate(data);
  };

  return (
    <AuthLayout
      title={t("auth.createAccount")}
      subtitle={t("auth.createAccountSub")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white/90">
            {t("auth.fullName")}
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder={t("auth.fullNamePlaceholder")}
            icon={<User className="h-4 w-4" />}
            error={!!errors.name}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-brand-400"
            {...register("name")}
          />
          <FormMessage message={errors.name?.message} />
        </div>

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

        {/* Phone & National ID in a row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white/90">
              {t("auth.phone")}
            </Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+93 700..."
              icon={<Phone className="h-4 w-4" />}
              error={!!errors.phone}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-brand-400"
              {...register("phone")}
            />
            <FormMessage message={errors.phone?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationalId" className="text-white/90">
              {t("auth.nationalId")}
            </Label>
            <Input
              id="nationalId"
              type="text"
              placeholder="12345..."
              icon={<CreditCard className="h-4 w-4" />}
              error={!!errors.nationalId}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-brand-400"
              {...register("nationalId")}
            />
            <FormMessage message={errors.nationalId?.message} />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white/90">
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
          <PasswordStrength password={password} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white/90">
            {t("auth.confirmPassword")}
          </Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={t("auth.passwordPlaceholder")}
            icon={<Lock className="h-4 w-4" />}
            error={!!errors.confirmPassword}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-brand-400"
            {...register("confirmPassword")}
          />
          <FormMessage message={errors.confirmPassword?.message} />
        </div>

        {/* Submit */}
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

        {/* Sign in link */}
        <p className="text-center text-sm text-white/70 pt-2">
          {t("auth.haveAccount")}{" "}
          <Link
            to="/login"
            className="text-brand-300 hover:text-brand-200 font-medium transition-colors"
          >
            {t("auth.signIn")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
