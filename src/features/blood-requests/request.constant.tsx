import type { BloodGroup, BloodGroupRaw, BloodRequestStatus } from "./request.types";

export const bloodGroupLabelMap: Record<BloodGroupRaw, BloodGroup> = {
  apositive: "A+",
  anegative: "A-",
  bpositive: "B+",
  bnegative: "B-",
  abpositive: "AB+",
  abnegative: "AB-",
  opositive: "O+",
  onegative: "O-",
};

export const statusTone: Record<BloodRequestStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  fulfilled: "bg-blue-100 text-blue-800",
  cancelled: "bg-slate-200 text-slate-800",
};
