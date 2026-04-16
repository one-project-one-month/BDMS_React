export type BloodRequestUrgency = "low" | "medium" | "high" | "critical";

export type BloodGroupRaw =
  | "apositive"
  | "anegative"
  | "bpositive"
  | "bnegative"
  | "abpositive"
  | "abnegative"
  | "opositive"
  | "onegative";

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

export type RequestType = "emergency" | "pre-booked";

export type RelationshipToPatient =
  | "self"
  | "parent"
  | "spouse"
  | "child"
  | "sibling"
  | "relative"
  | "friend"
  | "guardian"
  | "other";

export const BLOOD_GROUP_OPTIONS: BloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export const REQUEST_TYPE_OPTIONS: RequestType[] = ["emergency", "pre-booked"];

export const RELATIONSHIP_OPTIONS: RelationshipToPatient[] = [
  "self",
  "parent",
  "spouse",
  "child",
  "sibling",
  "relative",
  "friend",
  "guardian",
  "other",
];

export interface BloodRequestFormValues {
  patientName: string;
  bloodGroup: BloodGroup;
  hospitalId: number;
  hospitalAddress: string;
  unitsRequired: number;
  requiredDate: Date;
  requestType: RequestType;
  relationshipToPatient: RelationshipToPatient;
  contactPhone: string;
  reason: string;
  additionalNotes: string;
}

export interface BloodRequest {
  id: number;
  userId: number;
  hospitalId: number;
  bloodRequestCode: string;
  patientName: string;
  bloodGroup: BloodGroup;
  hospitalName: string;
  hospitalAddress: string;
  unitsRequired: number;
  contactPhone: string;
  urgency: BloodRequestUrgency;
  requestType: RequestType;
  relationshipToPatient: RelationshipToPatient;
  requiredDate: string;
  status: BloodRequestStatus;
  reason: string;
  additionalNotes: string | null;
  approvedBy: number | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateBloodRequestPayload {
  userId: number;
  hospitalId: number;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  contactPhone: string;
  urgency: BloodRequestUrgency;
  requiredDate: string;
  reason: string;
}

export interface UpdateBloodRequestPayload extends CreateBloodRequestPayload {
  id: number;
}

export interface RequestMutationInput {
  userId: number;
  values: BloodRequestFormValues;
}

export interface RequestStatusUpdateInput {
  id: number;
  status: BloodRequestStatus;
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
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
