import { createAnnouncement, deleteAnnouncement, getAnnouncements } from "@/services/announcementService";
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query"; 


export const useAnnouncements = () => {

  return useQuery({
    queryKey: ["announcements"], 
    queryFn: getAnnouncements,
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