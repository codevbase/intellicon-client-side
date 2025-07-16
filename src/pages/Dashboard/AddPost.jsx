import React, { useState } from 'react';
import { FaPlus, FaImage, FaSave, FaTimes, FaCrown, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';


const AddPost = () => {
  const { user } = useAuth();
  const { useGetUserPostCount, useGetAllTags, useCreatePost } = usePosts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    authorImage: user?.photoURL || '',
    authorName: user?.displayName || '',
    title: '',
    description: '',
    tag: '',
    upVote: 0,
    downVote: 0
  });

  // Fetch user's post count and membership status
  const { data: userStats, isLoading: isLoadingUserStats } = useGetUserPostCount(user?.email);

  // Fetch available tags
  const { data: availableTags = [], isLoading: isLoadingTags } = useGetAllTags();

  // Fallback tags if API fails or returns empty
  const defaultTags = [
    'Technology',
    'Programming',
    'Web Development',
    'React',
    'JavaScript',
    'Node.js',
    'MongoDB',
    'Design',
    'UI/UX',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Business',
    'Startup',
    'Career',
    'Education',
    'Tutorial',
    'Tips & Tricks',
    'News',
    'General'
  ];

  // Use API tags if available, otherwise use default tags
  const tagsToShow = availableTags.length > 0 ? availableTags : defaultTags;

  // Create post mutation
  const createPostMutation = useCreatePost();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const postData = {
        title: formData.title,
        description: formData.description,
        tag: formData.tag,
        authorName: formData.authorName,
        authorImage: formData.authorImage
      };

      await createPostMutation.mutateAsync(postData);
      
      // Reset form on success
      setFormData({
        authorImage: user?.photoURL || '',
        authorName: user?.displayName || '',
        title: '',
        description: '',
        tag: '',
        upVote: 0,
        downVote: 0
      });
      
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error(error.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      authorImage: user?.photoURL || '',
      authorName: user?.displayName || '',
      title: '',
      description: '',
      tag: '',
      upVote: 0,
      downVote: 0
    });
  };

  const handleBecomeMember = () => {
    // Navigate to membership page
    window.location.href = '/membership';
  };

  // Check if user has reached post limit (5 posts for normal users)
  const userPostCount = userStats?.postCount || 0;
  const isMember = userStats?.isMember || false;
  const hasReachedLimit = !isMember && userPostCount >= 5;

  if (isLoadingUserStats || isLoadingTags) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-600 mt-1">Share your thoughts and ideas with the community.</p>
      </div>

      {/* Post limit warning */}
      {!isMember && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaUser className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Post Limit: {userPostCount}/5
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                You have created {userPostCount} out of 5 allowed posts. 
                {hasReachedLimit ? ' Upgrade to membership for unlimited posts!' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Membership status */}
      {isMember && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaCrown className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Gold Member
              </h3>
              <p className="text-sm text-green-700 mt-1">
                You can create unlimited posts as a premium member!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show Become Member button if limit reached */}
      {hasReachedLimit ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <FaCrown className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Post Limit Reached
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You've reached the maximum number of posts (5) for free users. 
              Upgrade to our premium membership to create unlimited posts and unlock exclusive features!
            </p>
            <button
              onClick={handleBecomeMember}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaCrown className="w-5 h-5 mr-2" />
              Become a Member
            </button>
          </div>
        </div>
      ) : (
        /* Show Add Post form */
        <div className="max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Author Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Author Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="w-4 h-4 inline mr-2" />
                    Author Name
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaImage className="w-4 h-4 inline mr-2" />
                    Author Image URL
                  </label>
                  <input
                    type="url"
                    name="authorImage"
                    value={formData.authorImage}
                    onChange={handleInputChange}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

              </div>
            </div>

            {/* Post Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Post Content</h3>
              
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter a compelling title for your post..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-lg"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Post Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  placeholder="Write your post content here... You can use markdown formatting."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-vertical"
                />
              </div>

              {/* Tag Selection */}
              <div className="mb-4">
                <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
                  Tag *
                </label>
                <select
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="">Select a tag</option>
                  {tagsToShow.map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vote Counts (Hidden by default) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UpVote Count (Default: 0)
                  </label>
                  <input
                    type="number"
                    name="upVote"
                    value={formData.upVote}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DownVote Count (Default: 0)
                  </label>
                  <input
                    type="number"
                    name="downVote"
                    value={formData.downVote}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            {formData.title && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={formData.authorImage || '/default-avatar.png'}
                      alt="Author"
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{formData.authorName}</p>
                      <p className="text-sm text-gray-500">{formData.authorEmail}</p>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{formData.title}</h2>
                  {formData.tag && (
                    <span className="inline-block bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full mb-3">
                      {formData.tag}
                    </span>
                  )}
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {formData.description.substring(0, 200)}
                    {formData.description.length > 200 && '...'}
                  </p>
                  <div className="mt-3 text-sm text-gray-500">
                    <span>UpVotes: {formData.upVote}</span>
                    <span className="ml-4">DownVotes: {formData.downVote}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <FaTimes className="w-4 h-4 mr-2" />
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.description || !formData.tag}
                className="flex items-center px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4 mr-2" />
                    Publish Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddPost;
