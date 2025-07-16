import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { FaFlag, FaEye, FaTrash, FaCheck, FaTimes, FaExclamationTriangle, FaComment, FaUser, FaSearch, FaFilter } from 'react-icons/fa';


const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('pending');
  const queryClient = useQueryClient();

  const res =  axiosInstance.get('/posts/reported-comments');
console.log('Raw API response:', res.data);

  // Fetch reported comments (and potentially posts/users) from backend
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reported-comments'],
    queryFn: async () => {
      // Get reported comments
      const res = await axiosInstance.get('/posts/reported-comments');
      
      // Map backend data to a unified report structure
      // Only include comments with at least one report and valid postId
      return (res.data?.reportedComments || [])
        .filter(comment =>
          Array.isArray(comment.reports) && comment.reports.length > 0 &&
          typeof comment.postId === 'string' && /^[a-fA-F0-9]{24}$/.test(comment.postId)
        )
        .map(comment => ({
          id: comment._id,
          type: 'comment',
          content: comment.text,
          author: comment.email,
          reporter: comment.reports[0]?.reporterEmail || '',
          reason: comment.reports[0]?.feedback || '',
          status: comment.status || 'pending',
          reportedAt: comment.reports[0]?.reportedAt || comment.createdAt,
          postId: comment.postId,
          commentId: comment._id
        }));
    },
  });

  const reports = data || [];

  const filteredReports = reports.filter(report => 
    (report.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     report.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     report.reporter?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (typeFilter === 'all' || report.type === typeFilter) &&
    (statusFilter === 'all' || report.status === statusFilter)
  );

  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
  const handleStatusChange = async (reportId, newStatus) => {
    if (!isValidObjectId(reportId)) {
      alert('Invalid comment ID format.');
      return;
    }
    let action;
    if (newStatus === 'resolved') action = 'approve';
    else if (newStatus === 'dismissed') action = 'warn';
    else return;
    try {
      await axiosInstance.patch(`/posts/reported-comments/${reportId}`, { action });
      queryClient.invalidateQueries(['reported-comments']);
    } catch (err) {
      alert('Failed to update report status.');
      console.error(err);
    }
  };

  const handleDeleteContent = async (reportId) => {
    if (!isValidObjectId(reportId)) {
      alert('Invalid comment ID format.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      try {
        await axiosInstance.patch(`/posts/reported-comments/${reportId}`, { action: 'delete' });
        queryClient.invalidateQueries(['reported-comments']);
      } catch (err) {
        alert('Failed to delete comment.');
        console.error(err);
      }
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

  if (isLoading) {
    return <div className="text-center py-12">Loading reports...</div>;
  }
  if (isError) {
    return <div className="text-center py-12 text-red-500">Error loading reports.</div>;
  }

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