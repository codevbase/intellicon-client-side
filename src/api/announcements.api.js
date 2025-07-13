import axiosSecure from './axiosSecure';

// Get all announcements with pagination
export const getAllAnnouncements = async (page = 1, limit = 10) => {
  try {
    const response = await axiosSecure.get(`/announcements?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

// Get announcement count
export const getAnnouncementCount = async () => {
  try {
    const response = await axiosSecure.get('/announcements/count');
    return response.data;
  } catch (error) {
    console.error('Error fetching announcement count:', error);
    throw error;
  }
};

// Create a new announcement
export const createAnnouncement = async (announcementData) => {
  try {
    const response = await axiosSecure.post('/announcements', announcementData);
    return response.data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

// Update an announcement
export const updateAnnouncement = async (announcementId, announcementData) => {
  try {
    const response = await axiosSecure.put(`/announcements/${announcementId}`, announcementData);
    return response.data;
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

// Delete an announcement
export const deleteAnnouncement = async (announcementId) => {
  try {
    const response = await axiosSecure.delete(`/announcements/${announcementId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

// Add sample announcements (for development only)
export const addSampleAnnouncements = async () => {
  try {
    const response = await axiosSecure.post('/announcements/test');
    return response.data;
  } catch (error) {
    console.error('Error adding sample announcements:', error);
    throw error;
  }
}; 