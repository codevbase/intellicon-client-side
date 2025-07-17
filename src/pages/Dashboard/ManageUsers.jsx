import React, { useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaUserCheck, FaUserTimes, FaFilter } from 'react-icons/fa';
import { useGetPaginatedUsers } from '../../hooks/useUsers';
import { Helmet } from 'react-helmet-async';

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users with pagination
  const { data: usersData, isLoading, error } = useGetPaginatedUsers(currentPage, 10, searchTerm, statusFilter);
  const users = usersData?.users || usersData || [];
  const pagination = usersData?.pagination || {};

  const filteredUsers = users;

  const handleStatusChange = (userId, newStatus) => {
    console.log(`Change user ${userId} status to ${newStatus}`);
    // Update user status logic
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      console.log('Delete user:', userId);
      // Delete user logic
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      suspended: { color: 'bg-red-100 text-red-800', label: 'Suspended' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-purple-100 text-purple-800', label: 'Admin' },
      user: { color: 'bg-blue-100 text-blue-800', label: 'User' },
      moderator: { color: 'bg-orange-100 text-orange-800', label: 'Moderator' }
    };
    const config = roleConfig[role] || roleConfig.user;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Manage Users - IntelliCon Forum</title>
      </Helmet>
      <div className="space-y-6">
        {/* Page header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-1">View and manage user accounts and permissions.</p>
        </div>

        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Status filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading users...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">Failed to load users.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-cyan-600">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.posts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Suspend user"
                            >
                              <FaUserTimes className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(user.id, 'active')}
                              className="text-green-600 hover:text-green-900"
                              title="Activate user"
                            >
                              <FaUserCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => console.log('Edit user:', user.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit user"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete user"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-6">
            <button
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setCurrentPage(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
            >
              Prev
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`px-3 py-1 rounded border ${page === pagination.currentPage ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-700 border-gray-300'} hover:bg-cyan-50`}
                onClick={() => setCurrentPage(page)}
                disabled={page === pagination.currentPage}
              >
                {page}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setCurrentPage(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </button>
          </div>
        )}

        {/* Empty state */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No users have been registered yet.'
              }
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageUsers;
