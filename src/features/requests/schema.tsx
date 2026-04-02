import z from "zod";

export const formSchema = z.object({
  patientName: z.string().min(2).max(100),
  bloodType: z.string().refine(
    (val) => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(val),
    "Please select a valid blood type",
  ),
  hospitalName: z.string().min(2).max(200),
  address: z.string().min(5).max(500),
  numberOfUnits: z.number().int().min(1).max(20),
  requiredDate: z
    .date()
    .refine((val) => !Number.isNaN(val.getTime()), "Invalid date")
    .refine(
      (val) => val >= new Date(new Date().setHours(0, 0, 0, 0)),
      "Date cannot be in the past",
    ),
  requestType: z.string().refine(
    (val) => ["emergency", "pre-booked"].includes(val),
    "Please select request type",
  ),
  relationshipToPatient: z.string().refine(
    (val) => ["self","parent","spouse","child","sibling","relative","friend","guardian","other"].includes(val),
    "Please select relationship to patient",
  ),
  contactNumber: z.string().regex(/^[0-9+\-\s()]{8,20}$/, "Please enter a valid phone number"),
  reasonForRequest: z.string().min(10).max(500),
  additionalNotes: z.string().max(500).optional(),
});

export const steps = [
  {
    title: "Person Details",
    fields: ["patientName", "bloodType", "hospitalName", "address"],
  },
  {
    title: "Requirement Details",
    fields: ["numberOfUnits", "requiredDate", "requestType"],
  },
  {
    title: "Contact & Reason",
    fields: ["relationshipToPatient", "contactNumber", "reasonForRequest", "additionalNotes"],
  },
];