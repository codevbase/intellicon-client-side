import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router';
import { 
  FaCrown, 
  FaUsers, 
  FaBullhorn, 
  FaFlag, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt, 
  FaBars,
  FaTimes,
  FaHome,
  FaShieldAlt,
  FaDatabase,
  FaServer,
  FaExclamationTriangle,
  FaUserShield,
  FaClipboardList
} from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const adminNavigation = [
    {
      title: 'Overview',
      items: [
        { path: '/admin', icon: FaChartBar, label: 'Dashboard', exact: true },
        { path: '/admin/profile', icon: FaCrown, label: 'Admin Profile' },
        { path: '/admin/analytics', icon: FaDatabase, label: 'Analytics' },
      ]
    },
    {
      title: 'User Management',
      items: [
        { path: '/admin/users', icon: FaUsers, label: 'Manage Users' },
        // { path: '/admin/roles', icon: FaUserShield, label: 'Roles & Permissions' },
      ]
    },
    {
      title: 'Content Management',
      items: [
        { path: '/admin/make-announcement', icon: FaBullhorn, label: 'Create Announcement' },
        { path: '/admin/announcements', icon: FaClipboardList, label: 'Manage Announcements' },
        // { path: '/admin/posts', icon: FaClipboardList, label: 'Manage Posts' },
        // { path: '/admin/comments', icon: FaFlag, label: 'Moderate Comments' },
      ]
    },
    {
      title: 'System',
      items: [
        { path: '/admin/posts/reported-comments', icon: FaExclamationTriangle, label: 'Reports' },
        // { path: '/admin/settings', icon: FaCog, label: 'System Settings' },
        // { path: '/admin/logs', icon: FaServer, label: 'System Logs' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Admin Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <Link to="/admin" className="flex items-center space-x-3">
              <FaCrown className="w-8 h-8 text-purple-400" />
              <div>
                <span className="text-xl font-bold text-white">Admin</span>
                <span className="block text-xs text-gray-400">IntelliCon</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Admin User Profile */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={user?.photoURL || '/default-avatar.png'}
                  alt="Admin"
                  className="w-12 h-12 rounded-full border-2 border-purple-400 object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center">
                  <FaCrown className="w-2 h-2 text-gray-900" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.displayName || user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                  Administrator
                </span>
              </div>
            </div>
          </div>

          {/* Admin Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {/* Back to Main Site */}
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 border border-gray-600"
            >
              <FaHome className="w-4 h-4" />
              <span>Back to Site</span>
            </Link>

            {/* Navigation Sections */}
            {adminNavigation.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Admin Footer */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <FaBars className="w-5 h-5" />
            </button>

            {/* Admin Breadcrumb */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <FaCrown className="w-4 h-4 text-purple-600" />
                <span>Admin Panel</span>
                <span>/</span>
                <span className="text-gray-900 font-medium">Dashboard</span>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center space-x-4">
              {/* System Status */}
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>System Online</span>
              </div>

              {/* Admin User Menu */}
              <div className="flex items-center space-x-3">
                <img
                  src={user?.photoURL || '/default-avatar.png'}
                  alt="Admin"
                  className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.displayName || user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 