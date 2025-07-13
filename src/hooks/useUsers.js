import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../api/axiosSecure';

// Get all users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosSecure.get('/users');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user by email
export const useGetUserByEmail = (email) => {
  return useQuery({
    queryKey: ['user', email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${email}`);
      return response.data;
    },
    enabled: !!email,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update user role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, role }) => {
      const response = await axiosSecure.put(`/users/${email}/role`, { role });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch users
      queryClient.invalidateQueries(['users']);
    },
  });
};

// Update user status
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, status }) => {
      const response = await axiosSecure.put(`/users/${email}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch users
      queryClient.invalidateQueries(['users']);
    },
  });
};

// Create new admin
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email }) => {
      const response = await axiosSecure.post('/admin/create-admin', { email });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch users
      queryClient.invalidateQueries(['users']);
    },
  });
}; 