import axiosSecure from './axiosSecure';

// Get total user count
export const getTotalUserCount = async () => {
  try {
    const response = await axiosSecure.get('/users/count');
    return response.data;
  } catch (error) {
    console.error('Error fetching user count:', error);
    throw error;
  }
};
