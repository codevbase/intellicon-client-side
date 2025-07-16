import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaCrown, FaMedal, FaSpinner, FaEye, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import { Link } from 'react-router';
import  { useGetUserByEmail }  from '../../hooks/useUsers';

const MyProfile = () => {
  const { user } = useAuth();
  // console.log('user inside my profile', user);
  
  const { useGetUserPostCount, useGetUserRecentPosts } = usePosts();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    bio: user?.bio || 'No bio available'
  });

  // Fetch user stats, recent posts and user role
  const { data: userStats, isLoading: isLoadingStats } = useGetUserPostCount(user?.email);
  const { data: recentPosts, isLoading: isLoadingPosts } = useGetUserRecentPosts(user?.email, 3);
  const { data: userRoleData, isLoading: isLoadingRole } = useGetUserByEmail(user?.email);
  console.log('userRoleData', userRoleData);
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVoteDifference = (post) => {
    return (post?.upVote || 0) - (post?.downVote || 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically update the user profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
      bio: user?.bio || 'No bio available'
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account information and view your activity.</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200"
          >
            {isEditing ? <FaTimes className="w-4 h-4 mr-2" /> : <FaEdit className="w-4 h-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile picture and basic info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <img
                src={user?.photoURL || '/default-avatar.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto border-4 border-cyan-400 object-cover"
              />
              <h2 className="text-xl font-semibold text-gray-900 mt-4">
                {user?.displayName || 'User Name'}
              </h2>
              <p className="text-gray-500">{user?.email}</p>
              {/* User Role */}
              {!isLoadingRole && userRoleData?.role && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  {userRoleData.role.charAt(0).toUpperCase() + userRoleData.role.slice(1)}
                </span>
              )}
              
              {/* Badges Section */}
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Badges</h3>
                <div className="flex justify-center space-x-3">
                  {/* Bronze Badge - Only visible for non-members */}
                  {!userStats?.isMember && (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-400">
                        <FaMedal className="w-6 h-6 text-amber-600" />
                      </div>
                      <span className="text-xs text-gray-600 mt-1">Bronze</span>
                    </div>
                  )}
                  {/* Gold Badge - Only visible for members */}
                  {userStats?.isMember && (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center border-2 border-yellow-400">
                        <FaCrown className="w-6 h-6 text-yellow-600" />
                      </div>
                      <span className="text-xs text-gray-600 mt-1">Gold</span>
                    </div>
                  )}
                </div>
                
                {!userStats?.isMember && (
                  <p className="text-xs text-gray-500 mt-2">
                    Become a member to unlock the Gold badge!
                  </p>
                )}
              </div>

              {/* User Stats */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                {isLoadingStats ? (
                  <div className="flex items-center justify-center py-4">
                    <FaSpinner className="animate-spin h-5 w-5 text-cyan-600" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{userStats?.postCount || 0}</p>
                        <p className="text-xs text-gray-500">Posts</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">-</p>
                        <p className="text-xs text-gray-500">Comments</p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">
                        {userStats?.isMember ? 'Premium Member' : 'Free User'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile details and recent posts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="w-4 h-4 inline mr-2" />
                  Display Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.displayName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.bio}</p>
                )}
              </div>

              {/* Save button when editing */}
              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200"
                  >
                    <FaSave className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">My Recent Posts</h3>
            </div>
            <div className="p-6">
              {isLoadingPosts ? (
                <div className="flex items-center justify-center py-8">
                  <FaSpinner className="animate-spin h-6 w-6 text-cyan-600" />
                </div>
              ) : recentPosts && recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{post.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {post.status || 'published'}
                        </span>
                        <Link
                          to={`/post/${post._id}`}
                          className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts yet. Start sharing your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
