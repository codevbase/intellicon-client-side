import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FaChartBar, FaUsers, FaFileAlt, FaEye, FaThumbsUp, FaComment, FaPlus, FaUser } from 'react-icons/fa';

const DashBoard = () => {
  // Example data - replace with your actual data
  const stats = [
    { title: 'Total Posts', value: '1,234', icon: FaFileAlt, color: 'bg-blue-500' },
    { title: 'Total Views', value: '45,678', icon: FaEye, color: 'bg-green-500' },
    { title: 'Total Likes', value: '8,901', icon: FaThumbsUp, color: 'bg-yellow-500' },
    { title: 'Total Comments', value: '2,345', icon: FaComment, color: 'bg-purple-500' },
  ];

  const recentActivities = [
    { action: 'New post published', time: '2 hours ago', type: 'post' },
    { action: 'Comment received', time: '4 hours ago', type: 'comment' },
    { action: 'Post liked', time: '6 hours ago', type: 'like' },
    { action: 'Profile updated', time: '1 day ago', type: 'profile' },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - IntelliCon Forum</title>
      </Helmet>
      <div className="space-y-6">
        {/* Page header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your account.</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-cyan-300 text-cyan-700 rounded-lg hover:bg-cyan-50 transition-colors duration-200">
              <FaPlus className="w-4 h-4 mr-2" />
              Create New Post
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <FaFileAlt className="w-4 h-4 mr-2" />
              View My Posts
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <FaUser className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
