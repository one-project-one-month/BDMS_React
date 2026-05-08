import type { Donation } from "@/features/donations/donation.types";
import type { Hospital, User } from "@/features/users/user.types";

export type AppointmentStatus =
  | "scheduled"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rejected"
  | number
  | (string & {});

export interface Appointment {
  id: number;
  donationId: number | null;
  donorId?: number | null;
  hospitalId?: number | null;
  appointmentDate: string;
  status: AppointmentStatus;
  remarks?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  donation?: Donation | null;
  donor?: User | null;
  hospital?: Hospital | null;
}

export interface CreateAppointmentFromDonationPayload {
  remarks?: string;
}

export interface UpdateAppointmentStatusPayload {
  id: number;
  status: AppointmentStatus;
}

export interface UpdateAppointmentTimePayload {
  id: number;
  appointmentDate: string;
  appointmentTime: string;
}
