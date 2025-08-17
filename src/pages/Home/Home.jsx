import React, { useState } from 'react';
import { FaSearch, FaFilter, FaSort, FaEye, FaThumbsUp, FaThumbsDown, FaUser, FaClock, FaSpinner, FaTags } from 'react-icons/fa';
import { usePosts } from '../../hooks/usePosts';
import { Link } from 'react-router';
import Announcements from '../../components/Announcements/Announcements';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const { useGetAllPosts, useSearchPosts, useGetAllTags } = usePosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  // Get all tags for search suggestions
  const { data: tagsData } = useGetAllTags();
  const availableTags = tagsData || [
    'Technology', 'Programming', 'Web Development', 'React',
    'JavaScript', 'Node.js', 'MongoDB', 'Design', 'UI/UX',
    'Mobile Development', 'Data Science', 'Machine Learning',
    'Business', 'Startup', 'Career', 'Education', 'Tutorial',
    'Tips & Tricks', 'News', 'General'
  ];

  // Search parameters - prioritize tag search over general query search
  const searchParams = {
    query: '', // Use tag search instead of general query search
    tag: searchTerm, // Search by tag
    author: '',
    sortBy: 'newest'
  };

  // Get all posts or search results
  const searchQuery = useSearchPosts(searchParams);
  const allPostsQuery = useGetAllPosts(currentPage, 5, 'newest');

  const { data: postsData, isLoading, error } = isSearching ? searchQuery : allPostsQuery;

  const posts = postsData?.posts || [];
  const pagination = postsData?.pagination || {};
  const searchInfo = postsData?.searchInfo;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
    setIsSearching(true);
    setCurrentPage(1);
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
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-64">
          <FaSpinner className="animate-spin h-8 w-8 text-cyan-600" />
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
    <>
      <Helmet>
        <title>Home - IntelliCon Forum</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-6">
                Welcome to Intellicon Forum
              </h1>
              <p className="text-xl text-cyan-100 max-w-3xl mx-auto leading-relaxed">
                Discover, share, and discuss the latest in technology, programming, and innovation.
                Connect with developers, designers, and tech enthusiasts from around the world.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <FaSearch className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search posts by tag (e.g., React, JavaScript, Web Development)..."
                    className="block w-full pl-16 pr-32 py-4 text-lg border-0 rounded-full bg-white text-cyan-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-lg"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-2 bg-cyan-600 text-white font-semibold rounded-full hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300 transition-colors duration-200"
                    >
                      <FaSearch className="w-5 h-5 mr-2" />
                      Search
                    </button>
                  </div>
                </div>
              </form>

              {/* Popular Tags */}
              <div className="mt-8 text-center">
                <p className="text-cyan-100 mb-4 text-lg">Popular tags:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {availableTags.slice(0, 3).map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-cyan-600 rounded-full hover:bg-opacity-30 transition-all duration-200 text-sm font-medium"
                    >
                      <FaTags className="w-3 h-3 mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Announcements />
        </div>

        {/* Search Results Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search Status */}
          {isSearching && (
            <div className="mb-8">
              <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-cyan-600">
                    <FaSearch className="w-5 h-5 mr-2" />
                    <span className="font-medium">Search Results</span>
                  </div>
                  {searchInfo && (
                    <span className="text-gray-600">
                      Found {searchInfo.resultsFound} results for "{searchTerm}"
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClearSearch}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}

          {/* Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {posts.map(post => (
              <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-8">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                      <FaTags className="w-3 h-3 mr-1" />
                      {post.tag}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaClock className="w-3 h-3 mr-1" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>

                  {/* Post Title */}
                  <Link to={`/post/${post._id}`} className="block">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-cyan-600 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Post Description */}
                  <p className="text-gray-600 mb-6 line-clamp-3 text-lg leading-relaxed">
                    {post.description}
                  </p>

                  {/* Post Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-6">
                      <span className="flex items-center">
                        <FaEye className="w-4 h-4 mr-2" />
                        {post.views || 0} views
                      </span>
                      <span className="flex items-center text-green-600">
                        <FaThumbsUp className="w-4 h-4 mr-2" />
                        {post.upVote || 0}
                      </span>
                      <span className="flex items-center text-red-600">
                        <FaThumbsDown className="w-4 h-4 mr-2" />
                        {post.downVote || 0}
                      </span>
                      <span className={`font-semibold ${getVoteDifference(post) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {getVoteDifference(post) >= 0 ? '+' : ''}{getVoteDifference(post)} votes
                      </span>
                    </div>

                    <div className="flex items-center">
                      {/* <FaUser className="w-4 h-4 mr-2" /> */}
                      {/* {post.authorImage} */}
                      <img src={post.authorImage} alt="" className='w-5 h-5 rounded-full' />
                      {post.authorName || post.author}
                    </div>
                  </div>

                  {/* View Post Button */}
                  <Link
                    to={`/post/${post._id}`}
                    className="inline-flex items-center px-6 py-3 border-2 border-cyan-600 text-cyan-600 font-semibold rounded-lg hover:bg-cyan-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200"
                  >
                    <FaEye className="w-5 h-5 mr-2" />
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-4">
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
                        className={`px-3 py-2 text-sm border rounded-md mx-0.5 transition-colors duration-200 ${i === current
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

          {/* Empty State */}
          {posts.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FaSearch className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No posts found</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                {isSearching
                  ? `No posts found for "${searchTerm}". Try searching for a different tag or browse all posts.`
                  : 'No posts available at the moment. Be the first to share something amazing!'
                }
              </p>
              {isSearching && (
                <button
                  onClick={handleClearSearch}
                  className="mt-6 inline-flex items-center px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-200"
                >
                  Browse All Posts
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;