import React from 'react';
import { FaCrown, FaUsers, FaBullhorn, FaFlag } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router';

const AdminTest = () => {
  const { user } = useAuth();

  const adminFeatures = [
    {
      title: 'Admin Dashboard',
      description: 'Overview and system statistics',
      icon: FaCrown,
      path: '/admin',
      color: 'bg-purple-500'
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts and permissions',
      icon: FaUsers,
      path: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Announcements',
      description: 'Create and manage forum announcements',
      icon: FaBullhorn,
      path: '/admin/announcements',
      color: 'bg-green-500'
    },
    {
      title: 'Reports',
      description: 'Review and manage reported content',
      icon: FaFlag,
      path: '/admin/reports',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard Test</h1>
          <p className="text-lg text-gray-600">Testing admin functionality and routes</p>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg text-gray-900">{user?.email || 'Not logged in'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-lg text-gray-900">{user?.role || 'No role assigned'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Badge</p>
              <p className="text-lg text-gray-900">{user?.badge || 'No badge'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Is Admin</p>
              <p className="text-lg text-gray-900">{user?.role === 'admin' ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Admin Features */}
        {user?.role === 'admin' ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminFeatures.map((feature, index) => (
                <Link
                  key={index}
                  to={feature.path}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <FaCrown className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Admin Access Required</h3>
                <p className="text-yellow-700 mt-1">
                  You need admin privileges to access these features. Current role: {user?.role || 'No role'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Navigation Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTest; 