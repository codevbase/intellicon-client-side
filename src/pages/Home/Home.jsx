import React, { useState } from 'react';
import { FaSearch, FaFilter, FaSort, FaEye, FaThumbsUp, FaThumbsDown, FaUser, FaClock, FaSpinner } from 'react-icons/fa';
import { usePosts } from '../../hooks/usePosts';
import { Link } from 'react-router';

const Home = () => {
  const { useGetAllPosts, useSearchPosts } = usePosts();
  const [searchParams, setSearchParams] = useState({
    query: '',
    tag: '',
    author: '',
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  // Get all posts or search results
  const searchQuery = useSearchPosts(searchParams);
  const allPostsQuery = useGetAllPosts(currentPage, 10, searchParams.sortBy);
  
  const { data: postsData, isLoading, error } = isSearching ? searchQuery : allPostsQuery;

  const posts = postsData?.posts || [];
  const pagination = postsData?.pagination || {};
  const searchInfo = postsData?.searchInfo;

  // Available tags for filter
  const availableTags = [
    'Technology', 'Programming', 'Web Development', 'React',
    'JavaScript', 'Node.js', 'MongoDB', 'Design', 'UI/UX',
    'Mobile Development', 'Data Science', 'Machine Learning',
    'Business', 'Startup', 'Career', 'Education', 'Tutorial',
    'Tips & Tricks', 'News', 'General'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'mostVoted', label: 'Most Voted' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchParams({
      query: '',
      tag: '',
      author: '',
      sortBy: 'newest'
    });
    setIsSearching(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getVoteDifference = (post) => {
    return (post.upVote || 0) - (post.downVote || 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading posts: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Intellicon Forum
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover, share, and discuss the latest in technology, programming, and innovation
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Query */}
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="query"
                    value={searchParams.query}
                    onChange={handleInputChange}
                    placeholder="Search posts by title or description..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Tag Filter */}
              <div>
                <select
                  name="tag"
                  value={searchParams.tag}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="">All Tags</option>
                  {availableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  name="sortBy"
                  value={searchParams.sortBy}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white font-medium rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  <FaSearch className="w-4 h-4 mr-2" />
                  Search
                </button>
                {isSearching && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Clear Search
                  </button>
                )}
              </div>

              {/* Search Info */}
              {searchInfo && (
                <div className="text-sm text-gray-600">
                  Found {searchInfo.resultsFound} results
                  {searchInfo.query && ` for "${searchInfo.query}"`}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                    {post.tag}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="w-3 h-3 mr-1" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>

                {/* Post Title */}
                <Link to={`/post/${post._id}`} className="block">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-cyan-600 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                {/* Post Description */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.description}
                </p>

                {/* Post Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <FaEye className="w-3 h-3 mr-1" />
                      {post.views || 0}
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
                  <div className="flex items-center text-gray-500">
                    <FaUser className="w-3 h-3 mr-1" />
                    {post.authorEmail}
                  </div>
                </div>

                {/* View Post Button */}
                <Link
                  to={`/post/${post._id}`}
                  className="inline-flex items-center px-4 py-2 border border-cyan-300 text-cyan-700 font-medium rounded-md hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
                >
                  <FaEye className="w-4 h-4 mr-2" />
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-700">
              Showing page {pagination.currentPage} of {pagination.totalPages} 
              ({pagination.totalPosts} total posts)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                {pagination.currentPage}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500">
              {isSearching 
                ? 'Try adjusting your search criteria or browse all posts.'
                : 'No posts available at the moment. Be the first to share something!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;