import React, { useState } from 'react';
import { FaCrown, FaUsers, FaBullhorn, FaFlag, FaChartBar, FaCog, FaEdit, FaSave, FaTimes, FaSpinner, FaEye, FaUserShield, FaDatabase, FaServer } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { useAnnouncements } from '../../hooks/useAnnouncements';

const AdminProfile = () => {
    const { user } = useAuth();
    const { useGetAnnouncementCount } = useAnnouncements();
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

    // Mock data for admin statistics
    const adminStats = {
        totalUsers: 1250,
        activeUsers: 890,
        totalPosts: 3450,
        totalComments: 12800,
        reportedContent: 23,
        pendingApprovals: 5,
        systemUptime: '99.9%',
        lastBackup: '2 hours ago'
    };

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
        </div>
    );
};

export default AdminProfile;