import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPostComments, reportComment } from '../../api/posts.api';
import axiosSecure from '../../api/axiosSecure';
import { FaSpinner } from 'react-icons/fa';

const FEEDBACK_OPTIONS = [
  'Spam or irrelevant',
  'Offensive or abusive',
  'Other (needs review)'
];

const CommentsPage = () => {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const [modalComment, setModalComment] = useState(null);
  const [feedbacks, setFeedbacks] = useState({}); // { commentId: feedback }
  const [reported, setReported] = useState({}); // { commentId: true }

  // Fetch comments for the post
  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getPostComments(postId),
    staleTime: 2 * 60 * 1000,
    enabled: !!postId,
  });

  // Report comment mutation
  const reportMutation = useMutation({
    mutationFn: ({ commentId, feedback }) => reportComment(postId, commentId, { feedback }),
    onSuccess: (data, variables) => {
      setReported((prev) => ({ ...prev, [variables.commentId]: true }));
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleFeedbackChange = (commentId, value) => {
    setFeedbacks((prev) => ({ ...prev, [commentId]: value }));
  };

  const handleReport = (commentId) => {
    if (feedbacks[commentId]) {
      reportMutation.mutate({ commentId, feedback: feedbacks[commentId] });
    }
  };

  const handleReadMore = (comment) => {
    setModalComment(comment);
  };

  const handleCloseModal = () => {
    setModalComment(null);
  };

  const handleAddSampleComments = async () => {
    try {
      await axiosSecure.post(`/posts/${postId}/comments/test`);
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    } catch (error) {
      console.error('Error adding sample comments:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <FaSpinner className="animate-spin h-8 w-8 text-cyan-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading comments: {error.message}</p>
      </div>
    );
  }

  const comments = data?.comments || [];

  console.log('CommentsPage - postId:', postId);
  console.log('CommentsPage - data:', data);
  console.log('CommentsPage - comments:', comments);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Comments for Post: {postId}</h1>
        <button
          onClick={handleAddSampleComments}
          className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
        >
          Add Sample Comments
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments.map((comment) => {
              const isLong = comment.text.length > 20;
              const truncated = isLong ? comment.text.slice(0, 20) + '...' : comment.text;
              const feedback = feedbacks[comment._id] || '';
              const isReported = reported[comment._id];
              return (
                <tr key={comment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comment.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {truncated}
                    {isLong && (
                      <button
                        className="ml-2 text-cyan-600 underline text-xs"
                        onClick={() => handleReadMore(comment)}
                      >
                        Read More
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={feedback}
                      onChange={(e) => handleFeedbackChange(comment._id, e.target.value)}
                      disabled={isReported}
                    >
                      <option value="">Select feedback</option>
                      {FEEDBACK_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      className={`px-3 py-1 rounded text-white text-xs font-medium ${feedback ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'} ${isReported ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!feedback || isReported || reportMutation.isLoading}
                      onClick={() => handleReport(comment._id)}
                    >
                      {isReported ? 'Reported' : 'Report'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* No comments state */}
        {comments.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
            <p className="text-gray-500">Be the first to comment on this post!</p>
          </div>
        )}
      </div>

      {/* Modal for full comment */}
      {modalComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-2">Full Comment</h2>
            <p className="text-gray-800 whitespace-pre-line break-words">{modalComment.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage; 