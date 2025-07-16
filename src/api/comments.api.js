import axiosSecure from './axiosSecure';

// Get total comment count
export const getTotalCommentCount = async () => {
  try {
    const response = await axiosSecure.get('/comments/count');
    return response.data;
  } catch (error) {
    console.error('Error fetching comment count:', error);
    throw error;
  }
};
