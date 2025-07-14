import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaBullhorn, FaSpinner, FaUpload, FaTimes } from 'react-icons/fa';
import { useCreateAnnouncement } from '../../hooks/useAnnouncements';
import useAuth from '../../hooks/useAuth';

const MakeAnnouncement = () => {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const createAnnouncementMutation = useCreateAnnouncement();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <FaTimes className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">
              Only administrators can create announcements.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);
      
      // Prepare announcement data
      const announcementData = {
        title: data.title,
        content: data.description, // Backend expects 'content', not 'description'
        authorName: data.authorName,
        authorImage: imagePreview || user.photoURL || '',
        priority: data.priority || 'normal',
        status: 'active'
      };

      await createAnnouncementMutation.mutateAsync(announcementData);
      
      toast.success('Announcement created successfully!');
      reset();
      setImagePreview(null);
      
    } catch (error) {
      toast.error('Failed to create announcement');
      console.error('Error creating announcement:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FaBullhorn className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Create Announcement</h1>
        </div>
        <p className="text-gray-600">
          Create important announcements that will be displayed to all users on the platform.
        </p>
      </div>

      {/* Announcement Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Author Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaUpload className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload an image for the announcement author
                </p>
              </div>
            </div>
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Name *
            </label>
            <input
              type="text"
              {...register('authorName', { 
                required: 'Author name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              defaultValue={user?.displayName || user?.name || ''}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter author name"
            />
            {errors.authorName && (
              <p className="text-red-600 text-sm mt-1">{errors.authorName.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Announcement Title *
            </label>
            <input
              type="text"
              {...register('title', { 
                required: 'Title is required',
                minLength: { value: 5, message: 'Title must be at least 5 characters' }
              })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter announcement title"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              {...register('priority')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' }
              })}
              rows={6}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter announcement description..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setImagePreview(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isUploading || createAnnouncementMutation.isPending}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {(isUploading || createAnnouncementMutation.isPending) ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                <>
                  <FaBullhorn className="-ml-1 mr-2 h-4 w-4" />
                  Create Announcement
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Sample Announcements */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Sample Announcement Ideas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Platform Updates</h4>
            <p className="text-sm text-blue-700">
              "New features have been added to improve your experience. Check out the latest updates!"
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Community Guidelines</h4>
            <p className="text-sm text-blue-700">
              "Please review our updated community guidelines to ensure a positive environment."
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Maintenance Notice</h4>
            <p className="text-sm text-blue-700">
              "Scheduled maintenance on Sunday from 2-4 AM. Service may be temporarily unavailable."
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Welcome Message</h4>
            <p className="text-sm text-blue-700">
              "Welcome to our community! We're excited to have you here. Start exploring and connecting!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeAnnouncement; 