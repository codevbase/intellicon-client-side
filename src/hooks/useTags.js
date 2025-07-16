import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTags, addTag, removeTag } from '../api/tags.api';

export const useGetTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });
};

export const useAddTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTag,
    onSuccess: () => {
      queryClient.invalidateQueries(['tags']);
    },
  });
};

export const useRemoveTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeTag,
    onSuccess: () => {
      queryClient.invalidateQueries(['tags']);
    },
  });
};
