import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPostComments, reportComment } from '../../api/posts.api';
import axiosSecure from '../../api/axiosSecure';
import { 
  FaSpinner, 
  FaArrowLeft, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaTimes,
  FaComment,
  FaFlag,
  FaEye
} from 'react-icons/fa';
import { toast } from 'react-toastify';

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
      toast.success('Comment reported successfully!');
    },
    onError: (error) => {
      toast.error('Failed to report comment. Please try again.');
      console.error('Error reporting comment:', error);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin h-8 w-8 text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="h-5 w-5 text-red-400 mr-3" />
            <h3 className="text-lg font-medium text-red-800">Error Loading Comments</h3>
          </div>
          <p className="text-red-700 mt-2">{error.message}</p>
          <Link 
            to={`/post/${postId}`}
            className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Post
          </Link>
        </div>
      </div>
    );
  }

  const comments = data?.comments || [];

  console.log('CommentsPage - postId:', postId);
  console.log('CommentsPage - data:', data);
  console.log('CommentsPage - comments:', comments);

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link 
            to={`/post/${postId}`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Post
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comments</h1>
            <p className="text-gray-600">Post ID: {postId}</p>
          </div>
        </div>
        {/* Remove Add Sample Comments button */}
      </div>
      {/* Comments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              <FaComment className="inline mr-2 h-5 w-5 text-purple-600" />
              Comments ({comments.length})
            </h2>
            <div className="text-sm text-gray-500">
              Click "Read More" to view full comments
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commenter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comments.map((comment) => {
                const isLong = comment.text.length > 20;
                const truncated = isLong ? comment.text.slice(0, 20) + '...' : comment.text;
                const feedback = feedbacks[comment._id] || '';
                const isReported = reported[comment._id];
                return (
                  <tr key={comment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-medium text-xs">
                            {comment.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{comment.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs">
                        <span className="text-gray-700">{truncated}</span>
                        {isLong && (
                          <button
                            className="ml-2 inline-flex items-center text-purple-600 hover:text-purple-800 text-xs font-medium"
                            onClick={() => handleReadMore(comment)}
                          >
                            <FaEye className="mr-1 h-3 w-3" />
                            Read More
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          feedback ? 'border-green-300 bg-green-50' : 'border-gray-300'
                        } ${isReported ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        className={`inline-flex items-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                          feedback && !isReported
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : isReported
                            ? 'bg-green-600 text-white cursor-not-allowed'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!feedback || isReported || reportMutation.isLoading}
                        onClick={() => handleReport(comment._id)}
                      >
                        {isReported ? (
                          <>
                            <FaCheckCircle className="mr-1 h-3 w-3" />
                            Reported
                          </>
                        ) : (
                          <>
                            <FaFlag className="mr-1 h-3 w-3" />
                            Report
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* No comments state */}
        {comments.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <FaComment className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No comments yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              This post doesn't have any comments yet. Be the first to share your thoughts!
            </p>
            <Link 
              to={`/post/${postId}`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Post
            </Link>
          </div>
        )}
      </div>

      {/* Modal for full comment */}
      {modalComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={handleCloseModal}
            >
              <FaTimes className="h-6 w-6" />
            </button>
            
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 font-semibold text-lg">
                  {modalComment.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Full Comment</h2>
                <p className="text-gray-600 text-sm">{modalComment.email}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-800 whitespace-pre-line break-words text-lg leading-relaxed">
                {modalComment.text}
              </p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage; 