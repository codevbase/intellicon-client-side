import { useQuery } from '@tanstack/react-query';
import { getTotalCommentCount } from '../api/comments.api';

export const useGetTotalCommentCount = () => {
  return useQuery({
    queryKey: ['comments', 'totalCount'],
    queryFn: getTotalCommentCount,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
