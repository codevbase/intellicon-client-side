import React, { useState } from 'react';
import { useGetTags, useAddTag, useRemoveTag } from '../../hooks/useTags';
import { FaCrown, FaUsers, FaBullhorn, FaFlag, FaChartBar, FaCog, FaEdit, FaSave, FaTimes, FaSpinner, FaEye, FaUserShield, FaDatabase, FaServer } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { useGetTotalUserCount } from '../../hooks/useUsers';
import { useGetTotalPostCount } from '../../hooks/usePosts';
import { useGetTotalCommentCount } from '../../hooks/useComments';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Helmet } from 'react-helmet-async';

const AdminProfile = () => {
    const { user } = useAuth();
    const { useGetAnnouncementCount } = useAnnouncements();
    const { data: userCountData } = useGetTotalUserCount();
    const { data: postCountData } = useGetTotalPostCount();
    const { data: commentCountData } = useGetTotalCommentCount();

    // Real data for admin statistics
    const adminStats = {
        totalUsers: userCountData?.totalUsers ?? '...',
        totalPosts: postCountData?.totalPosts ?? '...',
        totalComments: commentCountData?.totalComments ?? '...',
        // The following are still mock/hardcoded, update as needed
        activeUsers: 890,
        reportedContent: 23,
        pendingApprovals: 5,
        systemUptime: '99.9%',
        lastBackup: '2 hours ago'
    };

    // Pie chart data for site stats
    const pieData = [
        { name: 'Users', value: Number(adminStats.totalUsers) || 0 },
        { name: 'Posts', value: Number(adminStats.totalPosts) || 0 },
        { name: 'Comments', value: Number(adminStats.totalComments) || 0 },
    ];
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        role: user?.role || 'admin',
        permissions: user?.permissions || []
    });

    // Get announcement count for admin stats
    const { data: countData } = useGetAnnouncementCount();
    const announcementCount = countData?.count || 0;

    // ...removed duplicate adminStats declaration...

    const permissions = [
        { id: 'manage_users', label: 'Manage Users', description: 'Add, edit, delete user accounts' },
        { id: 'manage_posts', label: 'Manage Posts', description: 'Moderate and manage all posts' },
        { id: 'manage_comments', label: 'Manage Comments', description: 'Moderate and manage comments' },
        { id: 'manage_announcements', label: 'Manage Announcements', description: 'Create and manage announcements' },
        { id: 'view_reports', label: 'View Reports', description: 'Access to user reports and analytics' },
        { id: 'system_settings', label: 'System Settings', description: 'Access to system configuration' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePermissionToggle = (permissionId) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permissionId)
                ? prev.permissions.filter(id => id !== permissionId)
                : [...prev.permissions, permissionId]
        }));
    };

    const handleSave = () => {
        // Here you would typically update the admin profile
        console.log('Saving admin profile:', formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            displayName: user?.displayName || '',
            email: user?.email || '',
            role: user?.role || 'admin',
            permissions: user?.permissions || []
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center space-x-3">
                    <FaCrown className="w-8 h-8 text-purple-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
                        <p className="text-gray-600 mt-1">Manage your admin account and system overview</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Admin Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <img
                                src={user?.photoURL || '/default-avatar.png'}
                                alt="Admin"
                                className="w-16 h-16 rounded-full border-4 border-purple-200 object-cover"
                            />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {user?.displayName || 'Admin User'}
                                </h2>
                                <p className="text-gray-600">{user?.email}</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                                    <FaCrown className="w-3 h-3 mr-1" />
                                    Administrator
                                </span>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Display Name</label>
                                    <input
                                        type="text"
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        <FaSave className="w-4 h-4 mr-2" />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        <FaTimes className="w-4 h-4 mr-2" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                <FaEdit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* System Statistics */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FaChartBar className="w-5 h-5 mr-2 text-purple-600" />
                            System Overview
                        </h3>

                        {/* Pie Chart for Users, Posts, Comments */}
                        <div className="w-full flex justify-center mb-8">
                            <ResponsiveContainer width="100%" height={250} minWidth={250} minHeight={250}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <FaUsers className="w-6 h-6 text-blue-600" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-blue-600">Total Users</p>
                                        <p className="text-2xl font-semibold text-blue-900">{adminStats.totalUsers}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <FaEye className="w-6 h-6 text-green-600" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-600">Active Users</p>
                                        <p className="text-2xl font-semibold text-green-900">{adminStats.activeUsers}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <FaBullhorn className="w-6 h-6 text-purple-600" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-purple-600">Announcements</p>
                                        <p className="text-2xl font-semibold text-purple-900">{announcementCount}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <FaFlag className="w-6 h-6 text-red-600" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-red-600">Reports</p>
                                        <p className="text-2xl font-semibold text-red-900">{adminStats.reportedContent}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">System Status</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Uptime:</span>
                                        <span className="font-medium text-green-600">{adminStats.systemUptime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Last Backup:</span>
                                        <span className="font-medium">{adminStats.lastBackup}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Pending Approvals:</span>
                                        <span className="font-medium text-orange-600">{adminStats.pendingApprovals}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Content Stats</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Posts:</span>
                                        <span className="font-medium">{adminStats.totalPosts}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Comments:</span>
                                        <span className="font-medium">{adminStats.totalComments}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Permissions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUserShield className="w-5 h-5 mr-2 text-purple-600" />
                    Admin Permissions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                            <input
                                type="checkbox"
                                id={permission.id}
                                checked={formData.permissions.includes(permission.id)}
                                onChange={() => handlePermissionToggle(permission.id)}
                                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <div className="flex-1">
                                <label htmlFor={permission.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                                    {permission.label}
                                </label>
                                <p className="text-sm text-gray-500">{permission.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        <FaUsers className="w-5 h-5 mr-2" />
                        Manage Users
                    </button>
                    <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        <FaBullhorn className="w-5 h-5 mr-2" />
                        Create Announcement
                    </button>
                    <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        <FaFlag className="w-5 h-5 mr-2" />
                        View Reports
                    </button>
                </div>
            </div>
            {/* Tag Management Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaDatabase className="w-5 h-5 mr-2 text-purple-600" />
                    Tag Management
                </h3>
                <TagManagement />
            </div>
        </div>
    );
};


// Tag Management Component (connected to backend)
const TagManagement = () => {
    const { data: tags = [], isLoading, isError } = useGetTags();
    const addTagMutation = useAddTag();
    const removeTagMutation = useRemoveTag();
    const [newTag, setNewTag] = useState("");
    const [error, setError] = useState("");

    const handleAddTag = async (e) => {
        e.preventDefault();
        const trimmed = newTag.trim();
        if (!trimmed) {
            setError("Tag cannot be empty");
            return;
        }
        if (tags.includes(trimmed)) {
            setError("Tag already exists");
            return;
        }
        try {
            await addTagMutation.mutateAsync(trimmed);
            setNewTag("");
            setError("");
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to add tag");
        }
    };

    const handleRemoveTag = async (tag) => {
        try {
            await removeTagMutation.mutateAsync(tag);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to remove tag");
        }
    };

    return (
        <>
            <Helmet>
                <title>Admin Profile - IntelliCon Forum</title>
            </Helmet>
            <div>
                <form onSubmit={handleAddTag} className="flex items-center space-x-2 mb-4">
                    <input
                        type="text"
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        placeholder="Add new tag"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={addTagMutation.isLoading}
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        disabled={addTagMutation.isLoading}
                    >
                        {addTagMutation.isLoading ? 'Adding...' : 'Add Tag'}
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                {isLoading ? (
                    <span className="text-gray-500">Loading tags...</span>
                ) : isError ? (
                    <span className="text-red-500">Failed to load tags</span>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {tags.length === 0 ? (
                            <span className="text-gray-500">No tags added yet.</span>
                        ) : (
                            tags.map(tag => (
                                <span key={tag} className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-2 text-purple-500 hover:text-purple-700 focus:outline-none"
                                        title="Remove tag"
                                        disabled={removeTagMutation.isLoading}
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </span>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminProfile;