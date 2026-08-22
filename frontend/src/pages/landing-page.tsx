import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LogIn,
  Shield,
  Zap,
  Globe,
  Users,
  FileCheck,
  Clock,
} from "lucide-react";

import { AnimatedBackground } from "@/components/shared/animated-background";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      title: t("landing.fastProcessing"),
      description: t("landing.fastProcessingDesc"),
    },
    {
      icon: Shield,
      title: t("landing.secure"),
      description: t("landing.secureDesc"),
    },
    {
      icon: Globe,
      title: t("landing.multiLang"),
      description: t("landing.multiLangDesc"),
    },
    {
      icon: Clock,
      title: t("landing.access247"),
      description: t("landing.access247Desc"),
    },
  ];

  const stats = [
    { value: "50K+", label: t("landing.citizensServed") },
    { value: "20+", label: t("landing.servicesAvailable") },
    { value: "95%", label: t("landing.approvalRate") },
    { value: "<24h", label: t("landing.responseTime") },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />

      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Logo size="md" />
        <div className="flex items-center gap-2">
          <LanguageToggle variant="glass" />
          <ThemeToggle variant="glass" />
          <Button asChild variant="glass" size="sm" className="ml-2">
            <Link to="/login">
              <LogIn className="h-4 w-4" />
              {t("auth.login")}
            </Link>
          </Button>
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-slate-700 dark:text-slate-200">
              {t("landing.nowServing")}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {t("landing.hero")}
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            {t("landing.heroSub")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="gradient" size="xl">
              <Link to="/register">
                {t("landing.getStarted")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/login">
                <LogIn className="h-5 w-5" />
                {t("auth.signIn")}
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 max-w-4xl mx-auto"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t("landing.whyChoose")}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t("landing.whyChooseSub")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <FileCheck className="h-4 w-4" />
            <span>{t("landing.secureVerified")}</span>
            <Users className="h-4 w-4 ml-4" />
            <span>{t("landing.trustedBy")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
