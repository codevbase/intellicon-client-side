import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllAnnouncements, 
  getAnnouncementCount, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
  addSampleAnnouncements
} from '../api/announcements.api';

// Get all announcements with pagination
export const useGetAllAnnouncements = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['announcements', 'all', page, limit],
    queryFn: () => getAllAnnouncements(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get announcement count
export const useGetAnnouncementCount = () => {
  return useQuery({
    queryKey: ['announcements', 'count'],
    queryFn: () => getAnnouncementCount(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Create announcement mutation
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['announcements', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['announcements', 'count'] });
    },
    onError: (error) => {
      console.error('Error creating announcement:', error);
    },
  });
};

// Update announcement mutation
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ announcementId, announcementData }) => 
      updateAnnouncement(announcementId, announcementData),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['announcements', 'all'] });
    },
    onError: (error) => {
      console.error('Error updating announcement:', error);
    },
  });
};

// Delete announcement mutation
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['announcements', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['announcements', 'count'] });
    },
    onError: (error) => {
      console.error('Error deleting announcement:', error);
    },
  });
};

// Add sample announcements mutation (for development only)
export const useAddSampleAnnouncements = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addSampleAnnouncements,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['announcements', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['announcements', 'count'] });
    },
    onError: (error) => {
      console.error('Error adding sample announcements:', error);
    },
  });
};

// Legacy hook for backward compatibility
export const useAnnouncements = () => {
  return {
    useGetAllAnnouncements,
    useGetAnnouncementCount,
    useCreateAnnouncement,
    useUpdateAnnouncement,
    useDeleteAnnouncement,
    useAddSampleAnnouncements,
  };
}; 