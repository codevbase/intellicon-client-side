
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { FaBell, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Notification = () => {
  // Fetch notifications for the current user
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await axiosInstance.get('/notifications/announcements');
      console.log('Fetched notifications:', res.data);
      return res.data?.announcements || [];
    },
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <FaBell className="animate-bounce h-8 w-8 text-purple-600 mr-2" />
        <span className="text-gray-600">Loading notifications...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-64 text-red-600">
        <FaExclamationCircle className="h-6 w-6 mr-2" />
        <span>Error loading notifications: {error?.message || 'Unknown error'}</span>
      </div>
    );
  }

  const notifications = data || [];

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-3 border-b pb-4 mb-4">
        <FaBell className="h-8 w-8 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      </div>
      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <FaBell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No notifications yet</h3>
          <p className="text-gray-600">You're all caught up!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif._id || notif.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-start space-x-3 shadow-sm"
            >
              <div className="pt-1">
                {notif.read ? (
                  <FaCheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <FaBell className="h-5 w-5 text-purple-500" />
                )}
              </div>
              <div>
                <div className="text-gray-900 font-medium">{notif.title || 'Notification'}</div>
                <div className="text-gray-700 text-sm mt-1">{notif.message || notif.body}</div>
                <div className="text-xs text-gray-400 mt-2">
                  {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
