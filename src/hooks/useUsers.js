import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTotalUserCount } from '../api/users.api';
// Get total user count (for admin dashboard)
export const useGetTotalUserCount = () => {
  return useQuery({
    queryKey: ['users', 'totalCount'],
    queryFn: getTotalUserCount,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
import axiosSecure from '../api/axiosSecure';

// Get all users with optional search
export const useGetAllUsers = (search = '') => {
  return useQuery({
    queryKey: ['users', search],
    queryFn: async () => {
      const response = await axiosSecure.get(`/users${search ? `?search=${encodeURIComponent(search)}` : ''}`);
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

// Get user role
// export const useGetUserRole = (email) => {
//   return useQuery({
//     queryKey: ['user', email, 'role'],
//     queryFn: async () => {
//       const response = await axiosSecure.get(`/users/${email}/role`);
//       return response.data;
//     },
//   });
// };

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

// Get all users with pagination and optional search
export const useGetPaginatedUsers = (page = 1, limit = 10, search = '', status = '') => {
  return useQuery({
    queryKey: ['users', page, limit, search, status],
    queryFn: async () => {
      let query = `?page=${page}&limit=${limit}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (status && status !== 'all') query += `&status=${encodeURIComponent(status)}`;
      const response = await axiosSecure.get(`/users${query}`);
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 