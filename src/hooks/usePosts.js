import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllPosts, 
  getPostById, 
  createPost, 
  deletePost,
  getUserPosts, 
  getUserPostCount, 
  getAllTags, 
  getUserRecentPosts,
  searchPosts,
  getUserVoteForPost
} from '../api/posts.api';
import useAuth from './useAuth';

// Custom hook for posts functionality
export const usePosts = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get all posts with pagination and sorting
  const useGetAllPosts = (page = 1, limit = 5, sortBy = 'newest') => {
    return useQuery({
      queryKey: ['posts', 'all', page, limit, sortBy],
      queryFn: () => getAllPosts(page, limit, sortBy),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get single post by ID
  const useGetPostById = (postId) => {
    return useQuery({
      queryKey: ['posts', 'single', postId],
      queryFn: () => getPostById(postId),
      enabled: !!postId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Get user's posts with pagination
  const useGetUserPosts = (userEmail, page = 1, limit = 10) => {
    return useQuery({
      queryKey: ['posts', 'user', userEmail, page, limit],
      queryFn: () => getUserPosts(userEmail, page, limit),
      enabled: !!userEmail && !!user,
      staleTime: 3 * 60 * 1000, // 3 minutes
    });
  };

  // Get user's post count and membership status
  const useGetUserPostCount = (userEmail) => {
    return useQuery({
      queryKey: ['posts', 'count', userEmail],
      queryFn: () => getUserPostCount(userEmail),
      enabled: !!userEmail && !!user,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get all tags
  const useGetAllTags = () => {
    return useQuery({
      queryKey: ['posts', 'tags'],
      queryFn: () => getAllTags(),
      staleTime: 30 * 60 * 1000, // 30 minutes
    });
  };

  // Get user's recent posts
  const useGetUserRecentPosts = (userEmail, limit = 3) => {
    return useQuery({
      queryKey: ['posts', 'recent', userEmail, limit],
      queryFn: () => getUserRecentPosts(userEmail, limit),
      enabled: !!userEmail && !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Search posts
  const useSearchPosts = (searchParams) => {
    return useQuery({
      queryKey: ['posts', 'search', searchParams],
      queryFn: () => searchPosts(searchParams),
      enabled: !!(searchParams.query || searchParams.tag || searchParams.author),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Get the current user's vote for a post
  const useGetUserVoteForPost = (postId) => {
    return useQuery({
      queryKey: ['posts', 'vote', postId, user?.email],
      queryFn: () => getUserVoteForPost(postId),
      enabled: !!postId && !!user,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Create post mutation
  const useCreatePost = () => {
    return useMutation({
      mutationFn: createPost,
      onSuccess: (data) => {
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: ['posts', 'all'] });
        queryClient.invalidateQueries({ queryKey: ['posts', 'user'] });
        queryClient.invalidateQueries({ queryKey: ['posts', 'count'] });
        queryClient.invalidateQueries({ queryKey: ['posts', 'recent'] });
        
        // Add the new post to the cache
        queryClient.setQueryData(['posts', 'single', data.postId], data.post);
      },
      onError: (error) => {
        console.error('Error creating post:', error);
      },
    });
  };

  // Delete post mutation
  const useDeletePost = () => {
    return useMutation({
      mutationFn: deletePost,
      onSuccess: (data, postId) => {
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: ['posts', 'all'] });
        queryClient.invalidateQueries({ queryKey: ['posts', 'user'] });
        queryClient.invalidateQueries({ queryKey: ['posts', 'count'] });
        queryClient.invalidateQueries({ queryKey: ['posts', 'recent'] });
        
        // Remove the deleted post from cache
        queryClient.removeQueries({ queryKey: ['posts', 'single', postId] });
      },
      onError: (error) => {
        console.error('Error deleting post:', error);
      },
    });
  };

  return {
    useGetAllPosts,
    useGetPostById,
    useGetUserPosts,
    useGetUserPostCount,
    useGetAllTags,
    useGetUserRecentPosts,
    useSearchPosts,
    useCreatePost,
    useDeletePost,
    useGetUserVoteForPost,
  };
};
