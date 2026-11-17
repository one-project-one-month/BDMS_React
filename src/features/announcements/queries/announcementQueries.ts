import { mutationOptions, queryOptions } from "@tanstack/react-query";

import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  getAnnouncements,
  updateAnnouncement,
} from "../api/announcement.api";

import type { Announcement, AnnouncementResponseTypes } from "../announcement.types";
import { announcementKeys } from "./announcementKeys";

/**
 * Query: get all announcements.
 */
export const getAnnouncementQueryOptions = queryOptions<Announcement[]>({
  queryKey: announcementKeys.list(),
  queryFn: getAnnouncements,
});

/**
 * Query: get specific announcement.
 */
export const getAnnouncementByIdQueryOptions = (id: number) =>
  queryOptions<AnnouncementResponseTypes>({
    queryKey: announcementKeys.detail(id),
    queryFn: () => getAnnouncementById(id),
  });

/**
 * Mutation: create announcement record.
 */
export const createAnnouncementMutationOptions = mutationOptions<
  Announcement,
  unknown,
  Parameters<typeof createAnnouncement>[0]
>({
  mutationFn: createAnnouncement,
});

/**
 * Mutation: delete announcement record.
 */
export const deleteAnnouncementMutationOptions = mutationOptions<
  boolean,
  unknown,
  Parameters<typeof deleteAnnouncement>[0]
>({
  mutationFn: deleteAnnouncement,
});

/**
 * Mutation: update announcement record.
 */
export const updateAnnouncementMutationOptions = mutationOptions<
  Announcement,
  unknown,
  {
    id: Parameters<typeof updateAnnouncement>[0];
    data: Parameters<typeof updateAnnouncement>[1];
  }
>({
  mutationFn: ({ id, data }) => updateAnnouncement(id, data),
});
