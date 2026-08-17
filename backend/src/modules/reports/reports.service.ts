import { Role, RequestStatus, PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { ForbiddenError } from '../../utils/AppError.js';

interface ReportsFilters {
  startDate?: Date;
  endDate?: Date;
  departmentId?: string;
}

export class ReportsService {
  /**
   * System-wide overview (Admin only)
   */
  static async getOverview(filters: ReportsFilters = {}) {
    const { startDate, endDate } = filters;

    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;

    const requestWhere: Prisma.RequestWhereInput = {};
    if (startDate || endDate) requestWhere.createdAt = dateFilter;

    const [
      totalRequests,
      submittedRequests,
      underReviewRequests,
      approvedRequests,
      rejectedRequests,
      cancelledRequests,
      totalUsers,
      activeUsers,
      totalDepartments,
      activeServices,
      revenueData,
      recentRequests,
    ] = await Promise.all([
      prisma.request.count({ where: requestWhere }),
      prisma.request.count({ where: { ...requestWhere, status: RequestStatus.SUBMITTED } }),
      prisma.request.count({ where: { ...requestWhere, status: RequestStatus.UNDER_REVIEW } }),
      prisma.request.count({ where: { ...requestWhere, status: RequestStatus.APPROVED } }),
      prisma.request.count({ where: { ...requestWhere, status: RequestStatus.REJECTED } }),
      prisma.request.count({ where: { ...requestWhere, status: RequestStatus.CANCELLED } }),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.department.count({ where: { isActive: true } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.payment.aggregate({
        where: {
          status: PaymentStatus.SUCCESS,
          ...(startDate || endDate ? { paidAt: dateFilter } : {}),
        },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.request.findMany({
        where: requestWhere,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          citizen: { select: { name: true, email: true } },
          service: { select: { name: true, department: { select: { name: true } } } },
        },
      }),
    ]);

    // Calculate approval rate
    const processedRequests = approvedRequests + rejectedRequests;
    const approvalRate =
      processedRequests > 0 ? Math.round((approvedRequests / processedRequests) * 100) : 0;

    return {
      summary: {
        totalRequests,
        totalUsers,
        activeUsers,
        totalDepartments,
        activeServices,
        totalRevenue: Number(revenueData._sum.amount) || 0,
        totalPayments: revenueData._count,
        approvalRate,
      },
      requestsByStatus: {
        submitted: submittedRequests,
        underReview: underReviewRequests,
        approved: approvedRequests,
        rejected: rejectedRequests,
        cancelled: cancelledRequests,
      },
      recentRequests,
    };
  }

  /**
   * Requests by department
   */
  static async getRequestsByDepartment(filters: ReportsFilters = {}) {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      include: {
        services: {
          include: {
            requests: {
              where: this.buildRequestDateFilter(filters),
              select: { status: true },
            },
          },
        },
      },
    });

    return departments.map((dept) => {
      const allRequests = dept.services.flatMap((s) => s.requests);
      const approved = allRequests.filter((r) => r.status === RequestStatus.APPROVED).length;
      const rejected = allRequests.filter((r) => r.status === RequestStatus.REJECTED).length;
      const pending = allRequests.filter(
        (r) => r.status === RequestStatus.SUBMITTED || r.status === RequestStatus.UNDER_REVIEW,
      ).length;

      return {
        id: dept.id,
        name: dept.name,
        nameFa: dept.nameFa,
        code: dept.code,
        totalServices: dept.services.length,
        totalRequests: allRequests.length,
        approved,
        rejected,
        pending,
        approvalRate:
          approved + rejected > 0 ? Math.round((approved / (approved + rejected)) * 100) : 0,
      };
    });
  }

  /**
   * Revenue by department
   */
  static async getRevenueByDepartment(filters: ReportsFilters = {}) {
    const results = await prisma.$queryRaw<
      Array<{
        department_id: string;
        department_name: string;
        total_revenue: number;
        total_payments: bigint;
      }>
    >`
      SELECT 
        d.id AS department_id,
        d.name AS department_name,
        COALESCE(SUM(p.amount), 0)::float AS total_revenue,
        COUNT(p.id) AS total_payments
      FROM departments d
      LEFT JOIN services s ON s.department_id = d.id
      LEFT JOIN requests r ON r.service_id = s.id
      LEFT JOIN payments p ON p.request_id = r.id AND p.status = 'SUCCESS'
      ${filters.startDate ? Prisma.sql`AND p.paid_at >= ${filters.startDate}` : Prisma.empty}
      ${filters.endDate ? Prisma.sql`AND p.paid_at <= ${filters.endDate}` : Prisma.empty}
      WHERE d.is_active = true
      GROUP BY d.id, d.name
      ORDER BY total_revenue DESC;
    `;

    return results.map((r) => ({
      departmentId: r.department_id,
      departmentName: r.department_name,
      totalRevenue: Number(r.total_revenue) || 0,
      totalPayments: Number(r.total_payments),
    }));
  }

  /**
   * Popular services
   */
  static async getPopularServices(limit = 10, filters: ReportsFilters = {}) {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      include: {
        department: { select: { name: true } },
        _count: {
          select: {
            requests: this.buildRequestDateFilter(filters).createdAt
              ? { where: { createdAt: this.buildRequestDateFilter(filters).createdAt } }
              : true,
          },
        },
      },
      orderBy: { requests: { _count: 'desc' } },
      take: limit,
    });

    return services.map((s) => ({
      id: s.id,
      name: s.name,
      nameFa: s.nameFa,
      fee: Number(s.fee),
      department: s.department.name,
      requestCount: s._count.requests,
    }));
  }

  /**
   * Requests time-series (for charts)
   */
  static async getRequestsTimeSeries(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await prisma.$queryRaw<
      Array<{
        date: string;
        total: bigint;
        approved: bigint;
        rejected: bigint;
      }>
    >`
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'APPROVED') AS approved,
        COUNT(*) FILTER (WHERE status = 'REJECTED') AS rejected
      FROM requests
      WHERE created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC;
    `;

    return results.map((r) => ({
      date: r.date,
      total: Number(r.total),
      approved: Number(r.approved),
      rejected: Number(r.rejected),
    }));
  }

  /**
   * User growth time-series
   */
  static async getUserGrowth(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await prisma.$queryRaw<
      Array<{
        date: string;
        new_users: bigint;
      }>
    >`
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) AS new_users
      FROM users
      WHERE created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC;
    `;

    return results.map((r) => ({
      date: r.date,
      newUsers: Number(r.new_users),
    }));
  }

  /**
   * Department-specific report (for department heads)
   */
  static async getDepartmentReport(
    departmentId: string,
    user: { role: Role; departmentId?: string | null },
    filters: ReportsFilters = {},
  ) {
    // Authorization check
    if (user.role !== Role.ADMIN && user.departmentId !== departmentId) {
      throw new ForbiddenError('You can only view your own department reports');
    }

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        services: {
          include: {
            _count: { select: { requests: true } },
          },
        },
      },
    });

    if (!department) return null;

    const requestWhere: Prisma.RequestWhereInput = {
      service: { departmentId },
    };
    if (filters.startDate || filters.endDate) {
      requestWhere.createdAt = {};
      if (filters.startDate) requestWhere.createdAt.gte = filters.startDate;
      if (filters.endDate) requestWhere.createdAt.lte = filters.endDate;
    }

    const [total, approved, rejected, pending, revenue, officers] = await Promise.all([
      prisma.request.count({ where: requestWhere }),
      prisma.request.count({ where: { ...requestWhere, status: RequestStatus.APPROVED } }),
      prisma.request.count({ where: { ...requestWhere, status: RequestStatus.REJECTED } }),
      prisma.request.count({
        where: {
          ...requestWhere,
          status: { in: [RequestStatus.SUBMITTED, RequestStatus.UNDER_REVIEW] },
        },
      }),
      prisma.payment.aggregate({
        where: {
          status: PaymentStatus.SUCCESS,
          request: { service: { departmentId } },
        },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.user.count({
        where: {
          departmentId,
          role: { in: [Role.OFFICER, Role.HEAD] },
          isActive: true,
        },
      }),
    ]);

    return {
      department: {
        id: department.id,
        name: department.name,
        nameFa: department.nameFa,
        code: department.code,
      },
      summary: {
        totalServices: department.services.length,
        totalOfficers: officers,
        totalRequests: total,
        approved,
        rejected,
        pending,
        approvalRate:
          approved + rejected > 0 ? Math.round((approved / (approved + rejected)) * 100) : 0,
        totalRevenue: Number(revenue._sum.amount) || 0,
        totalPayments: revenue._count,
      },
      services: department.services.map((s) => ({
        id: s.id,
        name: s.name,
        fee: Number(s.fee),
        requestCount: s._count.requests,
      })),
    };
  }

  /**
   * Helper: Build date filter for requests
   */
  private static buildRequestDateFilter(filters: ReportsFilters): Prisma.RequestWhereInput {
    if (!filters.startDate && !filters.endDate) return {};
    const createdAt: Prisma.DateTimeFilter = {};
    if (filters.startDate) createdAt.gte = filters.startDate;
    if (filters.endDate) createdAt.lte = filters.endDate;
    return { createdAt };
  }

  /**
   * Export requests as CSV data
   */
  static async exportRequestsCSV(filters: ReportsFilters = {}) {
    const where: Prisma.RequestWhereInput = {};
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }
    if (filters.departmentId) {
      where.service = { departmentId: filters.departmentId };
    }

    const requests = await prisma.request.findMany({
      where,
      include: {
        citizen: { select: { name: true, email: true, nationalId: true } },
        service: {
          select: { name: true, fee: true, department: { select: { name: true } } },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10000, // Safety limit
    });

    // Build CSV
    const headers = [
      'Tracking Number',
      'Citizen Name',
      'Citizen Email',
      'National ID',
      'Service',
      'Department',
      'Status',
      'Fee',
      'Payment Status',
      'Created At',
      'Processed At',
    ];

    const rows = requests.map((r) => [
      r.trackingNumber,
      r.citizen.name,
      r.citizen.email,
      r.citizen.nationalId || 'N/A',
      r.service.name,
      r.service.department.name,
      r.status,
      Number(r.service.fee).toFixed(2),
      r.payment?.status || 'N/A',
      r.createdAt.toISOString(),
      r.processedAt?.toISOString() || 'N/A',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return csv;
  }
}
