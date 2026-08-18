export type Role = "CITIZEN" | "OFFICER" | "HEAD" | "ADMIN";

export type RequestStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR"
  | "REQUEST_UPDATE"
  | "SYSTEM";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  nationalId?: string | null;
  dateOfBirth?: string | null;
  phone?: string | null;
  avatar?: string | null;
  jobTitle?: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string | null;
  departmentId?: string | null;
  department?: Department | null;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  nameFa?: string | null;
  description?: string | null;
  descriptionFa?: string | null;
  code?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    services: number;
  };
}

export interface Service {
  id: string;
  name: string;
  nameFa?: string | null;
  description?: string | null;
  descriptionFa?: string | null;
  fee: number;
  processingDays: number;
  requiredDocuments?: string[] | null;
  isActive: boolean;
  departmentId: string;
  department?: Department;
  createdAt: string;
  updatedAt: string;
  _count?: {
    requests: number;
  };
}

export interface Document {
  id: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  publicId?: string;
  fileSize: number;
  mimeType: string;
  requestId: string;
  uploadedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  paymentMethod?: string;
  requestId: string;
  paidAt?: string;
  createdAt: string;
}

export interface RequestModel {
  id: string;
  trackingNumber: string;
  status: RequestStatus;
  notes?: string | null;
  rejectionReason?: string | null;
  citizenId: string;
  citizen?: Pick<User, "id" | "name" | "email" | "phone" | "nationalId">;
  serviceId: string;
  service?: Service;
  processedById?: string | null;
  processedBy?: Pick<User, "id" | "name" | "email" | "jobTitle">;
  documents?: Document[];
  payment?: Payment | null;
  processedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string | null;
  userId: string;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface RequestStats {
  total: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  cancelled: number;
}
