import React from 'react';
import { FaUsers, FaEye, FaBullhorn, FaFlag, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaClock, FaServer, FaDatabase, FaCog } from 'react-icons/fa';
import { useAnnouncements } from '../../hooks/useAnnouncements';

const AdminDashboard = () => {
  const { useGetAnnouncementCount } = useAnnouncements();
  const { data: countData } = useGetAnnouncementCount();
  const announcementCount = countData?.count || 0;

  // Mock data for admin statistics
  const stats = {
    totalUsers: 1250,
    activeUsers: 890,
    totalPosts: 3450,
    totalComments: 12800,
    reportedContent: 23,
    pendingApprovals: 5,
    systemUptime: '99.9%',
    lastBackup: '2 hours ago',
    newUsersToday: 12,
    postsToday: 45,
    commentsToday: 234
  };

  const recentActivities = [
    { id: 1, type: 'user', action: 'New user registered', user: 'john.doe@example.com', time: '5 minutes ago' },
    { id: 2, type: 'post', action: 'New post created', user: 'jane.smith@example.com', time: '15 minutes ago' },
    { id: 3, type: 'report', action: 'Content reported', user: 'moderator@intellicon.com', time: '1 hour ago' },
    { id: 4, type: 'announcement', action: 'Announcement published', user: 'admin@intellicon.com', time: '2 hours ago' },
    { id: 5, type: 'comment', action: 'Comment flagged', user: 'system', time: '3 hours ago' }
  ];

  const systemHealth = {
    database: { status: 'healthy', uptime: '99.9%' },
    server: { status: 'healthy', uptime: '99.8%' },
    api: { status: 'healthy', responseTime: '120ms' },
    storage: { status: 'warning', usage: '85%' }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <FaUsers className="w-4 h-4 text-blue-500" />;
      case 'post': return <FaEye className="w-4 h-4 text-green-500" />;
      case 'report': return <FaFlag className="w-4 h-4 text-red-500" />;
      case 'announcement': return <FaBullhorn className="w-4 h-4 text-purple-500" />;
      case 'comment': return <FaExclamationTriangle className="w-4 h-4 text-orange-500" />;
      default: return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-purple-100">Monitor and manage your IntelliCon forum from here</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <FaUsers className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600">+{stats.newUsersToday} today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <FaEye className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPosts.toLocaleString()}</p>
              <p className="text-xs text-green-600">+{stats.postsToday} today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <FaBullhorn className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Announcements</p>
              <p className="text-2xl font-semibold text-gray-900">{announcementCount}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <FaFlag className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reports</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.reportedContent}</p>
              <p className="text-xs text-red-600">Pending review</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaServer className="w-5 h-5 mr-2 text-purple-600" />
              System Health
            </h3>
            <div className="space-y-4">
              {Object.entries(systemHealth).map(([service, data]) => (
                <div key={service} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${data.status === 'healthy' ? 'bg-green-400' : data.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                    <span className="text-sm font-medium text-gray-900 capitalize">{service}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(data.status)}`}>
                      {data.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {data.uptime || data.responseTime || data.usage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaClock className="w-5 h-5 mr-2 text-purple-600" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <FaUsers className="w-4 h-4 mr-2" />
            Manage Users
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <FaBullhorn className="w-4 h-4 mr-2" />
            Create Announcement
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <FaFlag className="w-4 h-4 mr-2" />
            Review Reports
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <FaCog className="w-4 h-4 mr-2" />
            System Settings
          </button>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Today's Activity</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">New Users</span>
              <span className="font-medium">{stats.newUsersToday}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">New Posts</span>
              <span className="font-medium">{stats.postsToday}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">New Comments</span>
              <span className="font-medium">{stats.commentsToday}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">System Info</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uptime</span>
              <span className="font-medium">{stats.systemUptime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Backup</span>
              <span className="font-medium">{stats.lastBackup}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pending Approvals</span>
              <span className="font-medium">{stats.pendingApprovals}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Performance</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Users</span>
              <span className="font-medium">{stats.activeUsers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Comments</span>
              <span className="font-medium">{stats.totalComments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Engagement Rate</span>
              <span className="font-medium">78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 