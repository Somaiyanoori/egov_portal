import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Users,
  Building2,
  Package,
  BarChart3,
  FileText,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";

export function AdminDashboard() {
  const { t } = useTranslation();

  const adminSections = [
    {
      title: t("adminSections.userManagement"),
      description: t("adminSections.userManagementDesc"),
      icon: Users,
      href: "/app/admin/users",
      color: "from-blue-500 to-blue-700",
      bg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: t("adminSections.departmentManagement"),
      description: t("adminSections.departmentManagementDesc"),
      icon: Building2,
      href: "/app/admin/departments",
      color: "from-purple-500 to-purple-700",
      bg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: t("adminSections.serviceManagement"),
      description: t("adminSections.serviceManagementDesc"),
      icon: Package,
      href: "/app/admin/services",
      color: "from-brand-500 to-brand-700",
      bg: "bg-brand-500/10",
      iconColor: "text-brand-500",
    },
    {
      title: t("adminSections.reportsAnalytics"),
      description: t("adminSections.reportsAnalyticsDesc"),
      icon: BarChart3,
      href: "/app/admin/reports",
      color: "from-green-500 to-green-700",
      bg: "bg-green-500/10",
      iconColor: "text-green-500",
    },
    {
      title: t("adminSections.allRequests"),
      description: t("adminSections.allRequestsDesc"),
      icon: FileText,
      href: "/app/requests",
      color: "from-orange-500 to-orange-700",
      bg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.dashboard")}
        description={t("dashboard.systemOverview")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminSections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={section.href}>
                <Card className="group hover:shadow-colorful transition-all hover:-translate-y-1 h-full">
                  <CardContent className="p-6">
                    <div
                      className={`h-12 w-12 rounded-xl ${section.bg} flex items-center justify-center mb-4`}
                    >
                      <Icon className={`h-6 w-6 ${section.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {section.title}
                    </h3>
                    <p className="text-sm text-[color:var(--muted-foreground)] mb-4">
                      {section.description}
                    </p>
                    <div className="flex items-center text-sm font-medium text-[color:var(--primary)] group-hover:gap-2 transition-all gap-1">
                      {t("dashboard.manage")}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
