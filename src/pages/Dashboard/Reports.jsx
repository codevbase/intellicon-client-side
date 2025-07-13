import React, { useState } from 'react';
import { FaFlag, FaEye, FaTrash, FaCheck, FaTimes, FaExclamationTriangle, FaComment, FaUser, FaSearch, FaFilter } from 'react-icons/fa';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('pending');

  // Mock reported content data
  const [reports] = useState([
    {
      id: 1,
      type: 'comment',
      content: 'This is an inappropriate comment that violates community guidelines.',
      author: 'john.doe@example.com',
      reporter: 'jane.smith@example.com',
      reason: 'Inappropriate content',
      status: 'pending',
      reportedAt: '2024-01-20T10:30:00Z',
      postId: 'post123',
      commentId: 'comment456'
    },
    {
      id: 2,
      type: 'post',
      content: 'This post contains misleading information about technology.',
      author: 'mike.wilson@example.com',
      reporter: 'admin@intellicon.com',
      reason: 'Misleading information',
      status: 'reviewed',
      reportedAt: '2024-01-19T15:45:00Z',
      postId: 'post789'
    },
    {
      id: 3,
      type: 'user',
      content: 'User has been spamming the forum with irrelevant posts.',
      author: 'spam.user@example.com',
      reporter: 'moderator@intellicon.com',
      reason: 'Spam behavior',
      status: 'pending',
      reportedAt: '2024-01-18T09:15:00Z'
    }
  ]);

  const filteredReports = reports.filter(report => 
    (report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
     report.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
     report.reporter.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (typeFilter === 'all' || report.type === typeFilter) &&
    (statusFilter === 'all' || report.status === statusFilter)
  );

  const handleStatusChange = (reportId, newStatus) => {
    console.log(`Change report ${reportId} status to ${newStatus}`);
    // Update report status logic
  };

  const handleDeleteContent = (reportId) => {
    if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      console.log('Delete content for report:', reportId);
      // Delete content logic
    }
  };

  const handleViewContent = (report) => {
    console.log('View content:', report);
    // Navigate to content or show modal
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'comment':
        return <FaComment className="w-4 h-4" />;
      case 'post':
        return <FaEye className="w-4 h-4" />;
      case 'user':
        return <FaUser className="w-4 h-4" />;
      default:
        return <FaFlag className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      comment: { color: 'bg-blue-100 text-blue-800', label: 'Comment' },
      post: { color: 'bg-green-100 text-green-800', label: 'Post' },
      user: { color: 'bg-purple-100 text-purple-800', label: 'User' }
    };
    const config = typeConfig[type] || { color: 'bg-gray-100 text-gray-800', label: 'Unknown' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {getTypeIcon(type)}
        <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      reviewed: { color: 'bg-blue-100 text-blue-800', label: 'Reviewed' },
      resolved: { color: 'bg-green-100 text-green-800', label: 'Resolved' },
      dismissed: { color: 'bg-gray-100 text-gray-800', label: 'Dismissed' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getReasonBadge = (reason) => {
    const reasonConfig = {
      'Inappropriate content': { color: 'bg-red-100 text-red-800' },
      'Misleading information': { color: 'bg-orange-100 text-orange-800' },
      'Spam behavior': { color: 'bg-yellow-100 text-yellow-800' },
      'Harassment': { color: 'bg-red-100 text-red-800' },
      'Copyright violation': { color: 'bg-purple-100 text-purple-800' }
    };
    const config = reasonConfig[reason] || { color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {reason}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <FaFlag className="w-8 h-8 text-red-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Reports</h1>
            <p className="text-gray-600 mt-1">Review and manage reported content and users</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Reports</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <FaComment className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Comment Reports</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reports.filter(r => r.type === 'comment').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <FaEye className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Post Reports</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reports.filter(r => r.type === 'post').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <FaUser className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">User Reports</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reports.filter(r => r.type === 'user').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search reports by content, author, or reporter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Type filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
            >
              <option value="all">All Types</option>
              <option value="comment">Comments</option>
              <option value="post">Posts</option>
              <option value="user">Users</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map(report => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(report.type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 truncate">{report.content}</p>
                      <p className="text-xs text-gray-500">by {report.reporter}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getReasonBadge(report.reason)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(report.reportedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewContent(report)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View content"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(report.id, 'resolved')}
                            className="text-green-600 hover:text-green-900"
                            title="Resolve report"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(report.id, 'dismissed')}
                            className="text-gray-600 hover:text-gray-900"
                            title="Dismiss report"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteContent(report.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete content"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FaFlag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters.'
              : 'All reports have been reviewed and resolved.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports; 