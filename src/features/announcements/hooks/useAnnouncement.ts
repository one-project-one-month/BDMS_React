
import { createAnnouncement, deleteAnnouncement, getAnnouncementById, getAnnouncements, updateAnnouncement } from "@/services/announcementService";
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query"; 
import type { AnnouncementDetailTypes } from "../types/AnnouncementTypes";


export const useAnnouncements = () => {

  return useQuery({
    queryKey: ["announcements"], 
    queryFn: getAnnouncements,
  }); 
}; 

export const useAnnouncementById = (id?: number) => {
  return useQuery({
    queryKey: ["announcement", id],
    queryFn: () => getAnnouncementById(id!),
    enabled: !!id,
  });
};


export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: createAnnouncement, 
    onSuccess: () => {
      queryClient.invalidateQueries( {queryKey: ["announcements"]}); 
    }
  })
}

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: deleteAnnouncement, 
    onSuccess: () => {
      queryClient.invalidateQueries( {queryKey: ["announcements"]}); 
    }
  })
}

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: ({id, data} : {id: number; data: AnnouncementDetailTypes}) => updateAnnouncement(id, data), 

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["announcements"]});
    }
  }); 
}; 