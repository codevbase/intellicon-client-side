import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router';
import { 
  FaUser, 
  FaPlus, 
  FaList, 
  FaSignOutAlt, 
  FaUsers, 
  FaBullhorn, 
  FaFlag, 
  FaCrown,
  FaBars,
  FaTimes,
  FaHome,
  FaBell,
  FaSearch
} from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const DashboardLayout = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Example: Determine if user is admin (replace with your actual logic)
  const isAdmin = user?.role === 'admin';

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

  const navigationItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard', exact: true },
    { path: '/dashboard/profile', icon: FaUser, label: 'My Profile' },
    { path: '/dashboard/add-post', icon: FaPlus, label: 'Add Post' },
    { path: '/dashboard/my-posts', icon: FaList, label: 'My Posts' },
  ];

  const adminItems = [
    { path: '/dashboard/admin-profile', icon: FaCrown, label: 'Admin Profile' },
    { path: '/dashboard/manage-users', icon: FaUsers, label: 'Manage Users' },
    { path: '/dashboard/announcements', icon: FaBullhorn, label: 'Announcements' },
    { path: '/dashboard/posts/reported-comments', icon: FaFlag, label: 'Reports' },
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

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo-intellicon.png" alt="logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-cyan-600">IntelliCon</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* User profile */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src={user?.photoURL || '/default-avatar.png'}
                alt="User"
                className="w-12 h-12 rounded-full border-2 border-cyan-400 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.displayName || user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* Back to Home */}
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 border border-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>

            <div className="border-t border-gray-200 my-4"></div>

            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700 border-r-2 border-cyan-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Admin section */}
            {isAdmin && (
              <>
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin Panel
                  </p>
                </div>
                <div className="space-y-2">
                  {adminItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            )}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <FaBars className="w-5 h-5" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-lg mx-4 lg:mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md relative">
                <FaBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <img
                  src={user?.photoURL || '/default-avatar.png'}
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.displayName || user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
      <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;