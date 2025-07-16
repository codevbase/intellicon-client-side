import React, { useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaSort, FaSpinner, FaComment, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { usePosts } from '../../hooks/usePosts';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

const MyPosts = () => {
  const { user } = useAuth();
  console.log('MyPosts user email:', user?.email);
  const { useGetUserPosts, useDeletePost } = usePosts();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch user's posts with pagination
  const { data: postsData, isLoading, error } = useGetUserPosts(user?.email, currentPage, 10);
  const deletePostMutation = useDeletePost();
  
  const posts = postsData?.posts || [];
  const pagination = postsData?.pagination || {};

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'business', label: 'Business' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'views', label: 'Most Views' },
    { value: 'likes', label: 'Most Likes' }
  ];

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || post.tag === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'likes':
          return (b.upVote || 0) - (a.upVote || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleView = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleEdit = (postId) => {
    console.log('Edit post:', postId);
    // Navigate to edit page or open edit modal
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deletePostMutation.mutateAsync(postId);
        // Success message could be shown here
      } catch (error) {
        console.error('Error deleting post:', error);
        // Error message could be shown here
      }
    }
  };

  const handleComment = (postId) => {
    navigate(`/comments/${postId}`);
  };

  // Calculate total votes
  const getTotalVotes = (post) => {
    const upVotes = post.upVote || 0;
    const downVotes = post.downVote || 0;
    return upVotes - downVotes;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
          <p className="text-gray-600 mt-1">Manage and track your published content.</p>
        </div>
        <div className="flex items-center justify-center min-h-64">
          <FaSpinner className="animate-spin h-8 w-8 text-cyan-600" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
          <p className="text-gray-600 mt-1">Manage and track your published content.</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading posts: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
        <p className="text-gray-600 mt-1">Manage and track your published content.</p>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Category filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number of Votes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map(post => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                          {post.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 capitalize">
                      {post.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-green-600">
                        <FaThumbsUp className="w-3 h-3 mr-1" />
                        <span className="text-sm font-medium">{post.upVote || 0}</span>
                      </div>
                      <div className="flex items-center text-red-600">
                        <FaThumbsDown className="w-3 h-3 mr-1" />
                        <span className="text-sm font-medium">{post.downVote || 0}</span>
                      </div>
                      <div className="text-sm text-gray-900 font-medium">
                        ({getTotalVotes(post)})
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.views || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(post._id)}
                        className="flex items-center px-2 py-1 text-xs text-cyan-600 hover:bg-cyan-50 rounded transition-colors duration-200"
                        title="View Post"
                      >
                        <FaEye className="w-3 h-3 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleComment(post._id)}
                        className="flex items-center px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                        title="View Comments"
                      >
                        <FaComment className="w-3 h-3 mr-1" />
                        Comment
                      </button>
                      <button
                        onClick={() => handleEdit(post._id)}
                        className="flex items-center px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200"
                        title="Edit Post"
                      >
                        <FaEdit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={deletePostMutation.isPending}
                        className="flex items-center px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Post"
                      >
                        {deletePostMutation.isPending ? (
                          <FaSpinner className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <FaTrash className="w-3 h-3 mr-1" />
                        )}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t created any posts yet. Start sharing your thoughts!'
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
          <div className="text-sm text-gray-700 mb-2">
            Showing page {pagination.currentPage} of {pagination.totalPages} 
            ({pagination.totalPosts} total posts)
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            >
              Previous
            </button>
            {/* Numbered page buttons */}
            {(() => {
              const pageButtons = [];
              const total = pagination.totalPages;
              const current = pagination.currentPage;
              let start = Math.max(1, current - 2);
              let end = Math.min(total, current + 2);
              if (current <= 3) {
                end = Math.min(5, total);
              } else if (current >= total - 2) {
                start = Math.max(1, total - 4);
              }
              for (let i = start; i <= end; i++) {
                pageButtons.push(
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 text-sm border rounded-md mx-0.5 transition-colors duration-200 ${
                      i === current
                        ? 'bg-cyan-600 text-white border-cyan-600 font-semibold'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    disabled={i === current}
                  >
                    {i}
                  </button>
                );
              }
              return pageButtons;
            })()}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
