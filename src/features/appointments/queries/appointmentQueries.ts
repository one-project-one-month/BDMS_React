import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type {
  Appointment,
  UpdateAppointmentTimePayload,
  UpdateAppointmentStatusPayload,
} from "../appointment.types";
import {
  completeAppointment,
  createAppointmentFromDonation,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointmentTime,
  updateAppointmentStatus,
} from "../api/appointment.api";
import { appointmentKeys } from "./appointmentKeys";

export const getAppointmentsQueryOptions = queryOptions<Appointment[]>({
  queryKey: appointmentKeys.lists(),
  queryFn: getAppointments,
});

export const getAppointmentQueryOptions = (id: number) =>
  queryOptions<Appointment>({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => getAppointmentById(id),
  });

export const deleteAppointmentMutationOptions = mutationOptions<
  boolean,
  unknown,
  Parameters<typeof deleteAppointment>[0]
>({
  mutationFn: deleteAppointment,
});

export const createAppointmentFromDonationMutationOptions = mutationOptions<
  Appointment,
  unknown,
  {
    donationId: number;
    payload?: Parameters<typeof createAppointmentFromDonation>[1];
  }
>({
  mutationFn: ({ donationId, payload }) =>
    createAppointmentFromDonation(donationId, payload),
});

export const updateAppointmentStatusMutationOptions = mutationOptions<
  Appointment,
  unknown,
  UpdateAppointmentStatusPayload
>({
  mutationFn: ({ id, status }) => updateAppointmentStatus(id, status),
});

export const updateAppointmentTimeMutationOptions = mutationOptions<
  Appointment,
  unknown,
  UpdateAppointmentTimePayload
>({
  mutationFn: updateAppointmentTime,
});

export const completeAppointmentMutationOptions = mutationOptions<
  Appointment,
  unknown,
  Parameters<typeof completeAppointment>[0]
>({
  mutationFn: completeAppointment,
});
