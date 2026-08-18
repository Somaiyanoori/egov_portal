import { useAuthStore } from "@/stores/auth-store";
import { CitizenDashboard } from "./citizen-dashboard";
import { OfficerDashboard } from "./officer-dashboard";
import { AdminDashboard } from "./admin-dashboard";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) return <LoadingSpinner fullPage />;

  switch (user.role) {
    case "CITIZEN":
      return <CitizenDashboard />;
    case "OFFICER":
    case "HEAD":
      return <OfficerDashboard />;
    case "ADMIN":
      return <AdminDashboard />;
    default:
      return <div>Unknown role</div>;
  }
}
