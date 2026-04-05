export type BloodRequestUrgency = "low" | "medium" | "high" | "critical";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type BloodRequestStatus =
  | "pending"
  | "cancelled"
  | "approved"
  | "rejected"
  | "fulfilled";

export type BloodRequestStatusa =
  | "pending"
  | "cancelled"
  | "approved"
  | "rejected"
  | "fulfilled";

export interface BloodRequest {
  id: number;
  userId: number;
  hospitalId: number;
  bloodRequestCode: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  contactPhone: string;
  urgency: BloodRequestUrgency;
  requiredDate: Date;
  status: BloodRequestStatus;
  reason: string;
  approvedBy: number | null;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateBloodRequestPayload {
  userId: number;
  hospitalId: number;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  contactPhone: string;
  urgency: string;
  requiredDate: {
    year: number;
    month: number;
    day: number;
    dayOfWeek: number;
  };
  reason: string;
}

export interface UpdateBloodRequestPayload extends CreateBloodRequestPayload {
  id: number;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  isError: boolean;
  data: T;
  message: string;
}

export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
