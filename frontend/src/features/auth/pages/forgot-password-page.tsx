import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { AuthLayout } from "../components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import { authService } from "@/services/auth.service";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      setSent(true);
      toast.success("If the email exists, a reset link has been sent");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data.email);
  };

  return (
    <AuthLayout
      title={t("auth.resetPassword")}
      subtitle={t("auth.resetPasswordSub")}
    >
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
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

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              loading={mutation.isPending}
            >
              <Send className="h-4 w-4" />
              {t("auth.sendResetLink")}
            </Button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-white/70 hover:text-white transition-colors pt-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("auth.backToLogin")}
            </Link>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-4 py-4"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Check your email
              </h3>
              <p className="text-sm text-white/70">
                We've sent password reset instructions to your email address.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-200 transition-colors pt-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("auth.backToLogin")}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
