import {
  Download,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { reportsService } from "@/services/admin.service";
import {
  useReportsOverview,
  useReportsByDepartment,
  useReportsRevenueByDept,
  useReportsPopularServices,
  useReportsTimeSeries,
} from "@/hooks/use-admin";

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#eab308",
  "#10b981",
  "#06b6d4",
];

const STATUS_COLORS: Record<string, string> = {
  submitted: "#3b82f6",
  underReview: "#eab308",
  approved: "#10b981",
  rejected: "#ef4444",
  cancelled: "#6b7280",
};

export function ReportsPage() {
  const { data: overviewData, isLoading: overviewLoading } =
    useReportsOverview();
  const { data: byDeptData } = useReportsByDepartment();
  const { data: revenueData } = useReportsRevenueByDept();
  const { data: popularData } = useReportsPopularServices(5);
  const { data: timeSeriesData } = useReportsTimeSeries(30);

  const overview = overviewData?.data;
  const summary = overview?.summary;
  const byStatus = overview?.requestsByStatus;

  const statusChartData = byStatus
    ? Object.entries(byStatus).map(([key, value]) => ({
        name:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        value: value as number,
        fill: STATUS_COLORS[key] || "#6b7280",
      }))
    : [];

  const handleExport = async () => {
    try {
      const response = await reportsService.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `requests-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report exported successfully");
    } catch {
      toast.error("Failed to export");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="System-wide statistics and insights"
        action={
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      {/* Summary Stats */}
      {overviewLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Requests"
            value={summary?.totalRequests ?? 0}
            icon={FileText}
            color="brand"
            delay={0}
          />
          <StatCard
            title="Total Users"
            value={summary?.totalUsers ?? 0}
            icon={Users}
            color="blue"
            delay={0.1}
          />
          <StatCard
            title="Total Revenue"
            value={`${formatCurrency(summary?.totalRevenue ?? 0)} AFN`}
            icon={DollarSign}
            color="green"
            delay={0.2}
          />
          <StatCard
            title="Approval Rate"
            value={`${summary?.approvalRate ?? 0}%`}
            icon={TrendingUp}
            color="purple"
            delay={0.3}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests over time */}
        <Card>
          <CardHeader>
            <CardTitle>Requests Over Time</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {timeSeriesData?.data && timeSeriesData.data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData.data}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) =>
                      new Date(v).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="approved"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Approved"
                  />
                  <Line
                    type="monotone"
                    dataKey="rejected"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Rejected"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[color:var(--muted-foreground)] text-sm">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Requests by Status</CardTitle>
            <CardDescription>Current distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {statusChartData.length > 0 &&
            statusChartData.some((s) => s.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData.filter((s) => s.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent as number) * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[color:var(--muted-foreground)] text-sm">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue by Department
            </CardTitle>
            <CardDescription>Total earnings breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueData?.data && revenueData.data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData.data}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="departmentName"
                    fontSize={11}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any) => [
                      `${formatCurrency(value)} AFN`,
                      "Revenue",
                    ]}
                  />
                  <Bar
                    dataKey="totalRevenue"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[color:var(--muted-foreground)] text-sm">
                No revenue data
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Most Popular Services
            </CardTitle>
            <CardDescription>Top 5 by request count</CardDescription>
          </CardHeader>
          <CardContent>
            {popularData?.data && popularData.data.length > 0 ? (
              <div className="space-y-3">
                {popularData.data.map((service: any, idx: number) => (
                  <div key={service.id} className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{
                        backgroundColor:
                          CHART_COLORS[idx % CHART_COLORS.length],
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">
                          {service.name}
                        </p>
                        <span className="text-sm font-semibold shrink-0">
                          {service.requestCount}
                        </span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-[color:var(--accent)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.max((service.requestCount / (popularData.data[0].requestCount || 1)) * 100, 5)}%`,
                            backgroundColor:
                              CHART_COLORS[idx % CHART_COLORS.length],
                          }}
                        />
                      </div>
                      <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                        {service.department}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-[color:var(--muted-foreground)] text-sm">
                No services data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Department Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Department Performance
          </CardTitle>
          <CardDescription>Detailed breakdown per department</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--border)] bg-[color:var(--muted)]/30">
                  <th className="text-left p-3 text-xs font-semibold uppercase">
                    Department
                  </th>
                  <th className="text-right p-3 text-xs font-semibold uppercase">
                    Total
                  </th>
                  <th className="text-right p-3 text-xs font-semibold uppercase">
                    Approved
                  </th>
                  <th className="text-right p-3 text-xs font-semibold uppercase">
                    Rejected
                  </th>
                  <th className="text-right p-3 text-xs font-semibold uppercase">
                    Pending
                  </th>
                  <th className="text-right p-3 text-xs font-semibold uppercase">
                    Approval Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {(byDeptData?.data ?? []).map((dept: any) => (
                  <tr
                    key={dept.id}
                    className="border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--accent)]/30"
                  >
                    <td className="p-3 font-medium">{dept.name}</td>
                    <td className="p-3 text-right">{dept.totalRequests}</td>
                    <td className="p-3 text-right text-green-500">
                      {dept.approved}
                    </td>
                    <td className="p-3 text-right text-red-500">
                      {dept.rejected}
                    </td>
                    <td className="p-3 text-right text-yellow-500">
                      {dept.pending}
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {dept.approvalRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
