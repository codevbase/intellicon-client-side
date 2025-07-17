import React, { useState, useEffect } from 'react';
import { FaCrown, FaUserPlus, FaCheckCircle, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';
import axiosSecure from '../api/axiosSecure';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

const AdminSetup = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [adminExists, setAdminExists] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if admin exists on component mount
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        await axiosInstance.post('/setup-admin', { email: 'test@test.com' });
        // If we get here, no admin exists
        setAdminExists(false);
      } catch (error) {
        if (error.response?.status === 403) {
          // Admin already exists
          setAdminExists(true);
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminExists();
  }, []);

  const handleSetupAdmin = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      let response;
      
      if (adminExists && user?.role === 'admin') {
        // Use admin-only endpoint
        response = await axiosSecure.post('/admin/create-admin', { email });
      } else {
        // Use first-time setup endpoint
        response = await axiosInstance.post('/setup-admin', { email });
      }
      
      setResult({
        success: true,
        message: response.data.message,
        user: response.data.user
      });
      
      toast.success('Admin setup successful!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to setup admin';
      setResult({
        success: false,
        message: errorMessage
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (      
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin status...</p>
        </div>
      </div>
    );
  }

  // Show access denied for non-admin users when admin already exists
  if (adminExists && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FaShieldAlt className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              Only existing admins can create new admin users.
            </p>
            <p className="text-sm text-gray-500">
              Current role: {user?.role || 'No role assigned'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              {adminExists ? <FaShieldAlt className="w-6 h-6 text-purple-600" /> : <FaCrown className="w-6 h-6 text-purple-600" />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {adminExists ? 'Create New Admin' : 'Admin Setup'}
            </h1>
            <p className="text-gray-600 mt-2">
              {adminExists 
                ? 'Create a new admin user (admin only)'
                : 'Make your first user an admin to access the admin panel'
              }
            </p>
          </div>

          <form onSubmit={handleSetupAdmin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                User Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email address"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This user must already be registered in the system
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting up admin...
                </>
              ) : (
                <>
                  <FaUserPlus className="w-4 h-4 mr-2" />
                  Make Admin
                </>
              )}
            </button>
          </form>

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start">
                {result.success ? (
                  <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                ) : (
                  <FaExclamationTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                )}
                <div>
                  <h3 className={`text-sm font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? 'Success!' : 'Error'}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message}
                  </p>
                  {result.success && result.user && (
                    <div className="mt-2 text-xs text-green-600">
                      <p>Email: {result.user.email}</p>
                      <p>Role: {result.user.role}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Next Steps:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. After successful setup, logout and login again</li>
              <li>2. Look for "Admin Panel" in the header dropdown</li>
              <li>3. Click "Admin Panel" to access /admin</li>
              <li>4. Explore the admin dashboard features</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup; 