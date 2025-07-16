import axiosInstance from './axiosInstance';

// Get all tags
export const getTags = async () => {
  const res = await axiosInstance.get('/posts/tags');
  return res.data;
};

// Add a new tag
export const addTag = async (tagName) => {
  const res = await axiosInstance.post('/posts/tags', { name: tagName });
  return res.data;
};

// Remove a tag
export const removeTag = async (tagName) => {
  const res = await axiosInstance.delete(`/posts/tags/${encodeURIComponent(tagName)}`);
  return res.data;
};
