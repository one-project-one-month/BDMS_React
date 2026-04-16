import z from "zod";

import {
  BLOOD_GROUP_OPTIONS,
  RELATIONSHIP_OPTIONS,
  REQUEST_TYPE_OPTIONS,
} from "./request.types";

export const formSchema = z.object({
  patientName: z.string().trim().min(2).max(100),
  bloodGroup: z.enum(BLOOD_GROUP_OPTIONS, {
    error: "Please select a valid blood group",
  }),
  hospitalId: z.number().int().positive("Please select a hospital"),
  hospitalAddress: z.string().trim().min(5).max(500),
  unitsRequired: z.number().int().min(1).max(20),
  requiredDate: z
    .date()
    .refine((value) => !Number.isNaN(value.getTime()), "Invalid date")
    .refine(
      (value) => value >= new Date(new Date().setHours(0, 0, 0, 0)),
      "Date cannot be in the past",
    ),
  requestType: z.enum(REQUEST_TYPE_OPTIONS, {
    error: "Please select request type",
  }),
  relationshipToPatient: z.enum(RELATIONSHIP_OPTIONS, {
    error: "Please select relationship to patient",
  }),
  contactPhone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{8,20}$/, "Please enter a valid phone number"),
  reason: z.string().trim().min(10).max(500),
  additionalNotes: z.string().trim().max(500),
});

export const steps = [
  {
    title: "Patient Details",
    fields: ["patientName", "bloodGroup", "hospitalId", "hospitalAddress"],
  },
  {
    title: "Request Details",
    fields: ["unitsRequired", "requiredDate", "requestType"],
  },
  {
    title: "Contact & Reason",
    fields: ["relationshipToPatient", "contactPhone", "reason", "additionalNotes"],
  },
  {
    title: "Review & Submit",
    fields: [],
  },
] as const;
