import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllAnnouncements, 
  getAnnouncementCount, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
  addSampleAnnouncements
} from '../api/announcements.api';

// Custom hook for announcements functionality
export const useAnnouncements = () => {
  const queryClient = useQueryClient();

  // Get all announcements with pagination
  const useGetAllAnnouncements = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ['announcements', 'all', page, limit],
      queryFn: () => getAllAnnouncements(page, limit),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Get announcement count
  const useGetAnnouncementCount = () => {
    return useQuery({
      queryKey: ['announcements', 'count'],
      queryFn: () => getAnnouncementCount(),
      staleTime: 1 * 60 * 1000, // 1 minute
    });
  };

  // Create announcement mutation
  const useCreateAnnouncement = () => {
    return useMutation({
      mutationFn: createAnnouncement,
      onSuccess: (data) => {
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
  const useUpdateAnnouncement = () => {
    return useMutation({
      mutationFn: ({ announcementId, announcementData }) => 
        updateAnnouncement(announcementId, announcementData),
      onSuccess: (data) => {
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: ['announcements', 'all'] });
      },
      onError: (error) => {
        console.error('Error updating announcement:', error);
      },
    });
  };

  // Delete announcement mutation
  const useDeleteAnnouncement = () => {
    return useMutation({
      mutationFn: deleteAnnouncement,
      onSuccess: (data) => {
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
  const useAddSampleAnnouncements = () => {
    return useMutation({
      mutationFn: addSampleAnnouncements,
      onSuccess: (data) => {
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: ['announcements', 'all'] });
        queryClient.invalidateQueries({ queryKey: ['announcements', 'count'] });
      },
      onError: (error) => {
        console.error('Error adding sample announcements:', error);
      },
    });
  };

  return {
    useGetAllAnnouncements,
    useGetAnnouncementCount,
    useCreateAnnouncement,
    useUpdateAnnouncement,
    useDeleteAnnouncement,
    useAddSampleAnnouncements,
  };
}; 