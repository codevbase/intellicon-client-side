import React from 'react';
import { useParams, Link } from 'react-router';
import { FaUser, FaClock, FaEye, FaThumbsUp, FaThumbsDown, FaTag, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { usePosts } from '../../hooks/usePosts';

const PostDetails = () => {
  const { postId } = useParams();
  const { useGetPostById } = usePosts();

  // Fetch post details with author info and related posts
  const { data: post, isLoading, error } = useGetPostById(postId);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVoteDifference = (post) => {
    return (post?.upVote || 0) - (post?.downVote || 0);
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-64">
            <FaSpinner className="animate-spin h-8 w-8 text-cyan-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Post</h2>
            <p className="text-red-700">{error.message}</p>
            <Link
              to="/"
              className="inline-flex items-center mt-4 px-4 py-2 border border-red-300 text-red-700 font-medium rounded-md hover:bg-red-50"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-yellow-800 mb-2">Post Not Found</h2>
            <p className="text-yellow-700">The post you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/"
              className="inline-flex items-center mt-4 px-4 py-2 border border-yellow-300 text-yellow-700 font-medium rounded-md hover:bg-yellow-50"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Link>
        </div>

        {/* Main Post Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                  <FaTag className="w-3 h-3 mr-1" />
                  {post.tag}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="w-3 h-3 mr-1" />
                  {formatDate(post.createdAt)}
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <FaEye className="w-3 h-3 mr-1" />
                  {post.views || 0} views
                </span>
                <span className="flex items-center text-green-600">
                  <FaThumbsUp className="w-3 h-3 mr-1" />
                  {post.upVote || 0}
                </span>
                <span className="flex items-center text-red-600">
                  <FaThumbsDown className="w-3 h-3 mr-1" />
                  {post.downVote || 0}
                </span>
                <span className={`font-medium ${getVoteDifference(post) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {getVoteDifference(post) >= 0 ? '+' : ''}{getVoteDifference(post)} votes
                </span>
              </div>
            </div>

            {/* Post Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Author Information */}
            {post.author && (
              <div className="flex items-center space-x-3">
                {post.author.photoURL && (
                  <img
                    src={post.author.photoURL}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <FaUser className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {post.author.name || 'Unknown User'}
                    </span>
                    {post.author.isMember && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Member
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{post.author.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {post.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Related Posts</h2>
              <p className="text-gray-600 mt-1">More posts in the {post.tag} category</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {post.relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost._id}
                    to={`/post/${relatedPost._id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-cyan-600 bg-cyan-50 px-2 py-1 rounded">
                        {relatedPost.tag}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(relatedPost.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-cyan-600">
                      {relatedPost.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <FaEye className="w-3 h-3 mr-1" />
                        {relatedPost.views || 0}
                      </span>
                      <span className={`font-medium ${getVoteDifference(relatedPost) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {getVoteDifference(relatedPost) >= 0 ? '+' : ''}{getVoteDifference(relatedPost)} votes
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Link>
          
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center px-4 py-2 border border-green-300 text-green-700 font-medium rounded-md hover:bg-green-50">
              <FaThumbsUp className="w-4 h-4 mr-2" />
              Upvote
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 font-medium rounded-md hover:bg-red-50">
              <FaThumbsDown className="w-4 h-4 mr-2" />
              Downvote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
