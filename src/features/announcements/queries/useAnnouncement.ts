
import { createAnnouncement, deleteAnnouncement, getAnnouncementById, getAnnouncements, updateAnnouncement } from "@/services/announcementService";
import { useQuery, useMutation, useQueryClient, queryOptions, mutationOptions} from "@tanstack/react-query"; 
import { type Announcement, type AnnouncementDetailTypes, type AnnouncementResponseTypes } from "../types/AnnouncementTypes";
import { announcementKeys } from "./announcementKeys";


export const getAnnouncementQueryOptions = queryOptions<Announcement[]>({
    queryKey: announcementKeys.list(), 
    queryFn: getAnnouncements,
  }); 

export const getAnnouncementByIdQueryOptions = (id: number) => queryOptions<AnnouncementResponseTypes>({
    queryKey: announcementKeys.detail(id),
    queryFn: async () =>{
      const res = await getAnnouncementById(id); 
      return res.data[0];
    },
    enabled: !!id,
  });


export const createAnnouncementMutationOptions = mutationOptions<Announcement, unknown, AnnouncementDetailTypes>({
    mutationFn: createAnnouncement, 
    onSuccess: (_, __, ___, context) => {
      context.client.invalidateQueries( {queryKey: announcementKeys.all}); 
    }
});


export const deleteAnnouncementMutationOptions = mutationOptions< boolean, unknown, number> ({
    mutationFn: deleteAnnouncement, 
    onSuccess: (_, id, __, context) => {
      context.client.invalidateQueries({
        queryKey: announcementKeys.all,
      }); 

      context.client.invalidateQueries({
        queryKey: announcementKeys.detail(id),
      });
    }
});


export const updateAnnouncementMutationOptions = mutationOptions<
  Announcement, unknown, {id: number; data: AnnouncementDetailTypes}
>({
    mutationFn: ({id, data}) => updateAnnouncement(id, data), 

    onSuccess: (_, variables, __, context) => {
      context.client.invalidateQueries({queryKey: announcementKeys.all});

      context.client.invalidateQueries({
        queryKey: announcementKeys.detail(variables.id),
      });
    }
}); 
