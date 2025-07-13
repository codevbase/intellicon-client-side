import React from 'react';
import { useAnnouncements } from '../hooks/useAnnouncements';

const AnnouncementTest = () => {
  const { useGetAnnouncementCount, useAddSampleAnnouncements } = useAnnouncements();
  const { data: countData, isLoading, error } = useGetAnnouncementCount();
  const addSampleMutation = useAddSampleAnnouncements();

  const announcementCount = countData?.count || 0;

  const handleAddSample = async () => {
    try {
      await addSampleMutation.mutateAsync();
      console.log('Sample announcements added successfully');
    } catch (error) {
      console.error('Error adding sample announcements:', error);
    }
  };

  if (isLoading) return <div>Loading announcement count...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Announcement Test</h3>
      <p>Current announcement count: {announcementCount}</p>
      <button
        onClick={handleAddSample}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={addSampleMutation.isPending}
      >
        {addSampleMutation.isPending ? 'Adding...' : 'Add Sample Announcements'}
      </button>
    </div>
  );
};

export default AnnouncementTest; 