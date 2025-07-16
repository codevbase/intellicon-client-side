import axiosSecure from './axiosSecure';
// Get total post count
export const getTotalPostCount = async () => {
  try {
    const response = await axiosSecure.get('/posts/count');
    return response.data;
  } catch (error) {
    console.error('Error fetching post count:', error);
    throw error;
  }
};

// Get all posts with pagination and sorting
export const getAllPosts = async (page = 1, limit = 5, sortBy = 'newest') => {
  try {
    const response = await axiosSecure.get(`/posts?page=${page}&limit=${limit}&sortBy=${sortBy}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Get posts by popularity (vote difference)
export const getPostsByPopularity = async (page = 1, limit = 5) => {
  try {
    const response = await axiosSecure.get(`/posts/popular?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    throw error;
  }
};

// Get single post by ID
export const getPostById = async (postId) => {
  try {
    const response = await axiosSecure.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

// Create new post
export const createPost = async (postData) => {
  try {
    const response = await axiosSecure.post('/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Update post
export const updatePost = async (postId, postData) => {
  try {
    const response = await axiosSecure.put(`/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete post
export const deletePost = async (postId) => {
  try {
    const response = await axiosSecure.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Get user's posts
export const getUserPosts = async (userEmail, page = 1, limit = 10) => {
  try {
    const response = await axiosSecure.get(`/posts/user/${userEmail}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

// Get user's post count and membership status
export const getUserPostCount = async (userEmail) => {
  try {
    const response = await axiosSecure.get(`/posts/count/${userEmail}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user post count:', error);
    throw error;
  }
};

// Search posts with advanced filtering
export const searchPosts = async (searchParams) => {
  try {
    const { query = '', tag = '', author = '', sortBy = 'relevance', page = 1, limit = 10 } = searchParams;
    const params = new URLSearchParams();
    
    if (query) params.append('query', query);
    if (tag) params.append('tag', tag);
    if (author) params.append('author', author);
    if (sortBy) params.append('sortBy', sortBy);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    
    const response = await axiosSecure.get(`/posts/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

// Search posts by tags (legacy function for backward compatibility)
export const searchPostsByTags = async (searchTerm, page = 1, limit = 5) => {
  try {
    const response = await axiosSecure.get(`/posts/search?query=${searchTerm}&page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

// Upvote a post
export const upvotePost = async (postId) => {
  try {
    const response = await axiosSecure.patch(`/posts/${postId}/upvote`);
    return response.data;
  } catch (error) {
    console.error('Error upvoting post:', error);
    throw error;
  }
};

// Downvote a post
export const downvotePost = async (postId) => {
  try {
    const response = await axiosSecure.patch(`/posts/${postId}/downvote`);
    return response.data;
  } catch (error) {
    console.error('Error downvoting post:', error);
    throw error;
  }
};

// Get post comments
export const getPostComments = async (postId, page = 1, limit = 10) => {
  try {
    const response = await axiosSecure.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post comments:', error);
    throw error;
  }
};

// Add comment to post
export const addComment = async (postId, commentData) => {
  try {
    const response = await axiosSecure.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Delete comment
export const deleteComment = async (postId, commentId) => {
  try {
    const response = await axiosSecure.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Report comment
export const reportComment = async (postId, commentId, reportData) => {
  try {
    const response = await axiosSecure.post(`/posts/${postId}/comments/${commentId}/report`, reportData);
    return response.data;
  } catch (error) {
    console.error('Error reporting comment:', error);
    throw error;
  }
};

// Get all tags
export const getAllTags = async () => {
  try {
    const response = await axiosSecure.get('/posts/tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Add new tag (admin only)
export const addTag = async (tagData) => {
  try {
    const response = await axiosSecure.post('/posts/tags', tagData);
    return response.data;
  } catch (error) {
    console.error('Error adding tag:', error);
    throw error;
  }
};

// Get posts by tag
export const getPostsByTag = async (tag, page = 1, limit = 5) => {
  try {
    const response = await axiosSecure.get(`/posts/tag/${tag}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    throw error;
  }
};

// Get user's recent posts (for profile)
export const getUserRecentPosts = async (userEmail, limit = 3) => {
  try {
    const response = await axiosSecure.get(`/posts/user/${userEmail}/recent?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user recent posts:', error);
    throw error;
  }
};

// Get popular searches
export const getPopularSearches = async (limit = 3) => {
  try {
    const response = await axiosSecure.get(`/posts/popular-searches?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular searches:', error);
    throw error;
  }
};

// Add search term to popular searches
export const addSearchTerm = async (searchTerm) => {
  try {
    const response = await axiosSecure.post('/posts/popular-searches', { searchTerm });
    return response.data;
  } catch (error) {
    console.error('Error adding search term:', error);
    throw error;
  }
};

// Get post statistics (for admin)
export const getPostStats = async () => {
  try {
    const response = await axiosSecure.get('/posts/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching post stats:', error);
    throw error;
  }
};

// Update post visibility (public/private)
export const updatePostVisibility = async (postId, visibility) => {
  try {
    const response = await axiosSecure.patch(`/posts/${postId}/visibility`, { visibility });
    return response.data;
  } catch (error) {
    console.error('Error updating post visibility:', error);
    throw error;
  }
};

// Get reported comments (admin only)
export const getReportedComments = async (page = 1, limit = 10) => {
  try {
    const response = await axiosSecure.get(`/posts/reported-comments?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reported comments:', error);
    throw error;
  }
};

// Handle reported comment (admin only)
export const handleReportedComment = async (commentId, action) => {
  try {
    const response = await axiosSecure.patch(`/posts/reported-comments/${commentId}`, { action });
    return response.data;
  } catch (error) {
    console.error('Error handling reported comment:', error);
    throw error;
  }
};

// Get the current user's vote for a post
export const getUserVoteForPost = async (postId) => {
  try {
    const response = await axiosSecure.get(`/posts/${postId}/vote`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user vote:', error);
    throw error;
  }
};
