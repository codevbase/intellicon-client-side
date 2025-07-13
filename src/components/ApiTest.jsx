import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const ApiTest = () => {
  const [status, setStatus] = useState('');

  const testApi = async () => {
    try {
      setStatus('Testing API...');
      const response = await axiosInstance.get('/');
      setStatus(`API is working! Response: ${response.data}`);
      console.log('API Response:', response.data);
    } catch (error) {
      setStatus(`API Error: ${error.message}`);
      console.error('API Error:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">API Test</h2>
      <button 
        onClick={testApi}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Test API Connection
      </button>
      {status && (
        <div className="p-2 bg-gray-100 rounded">
          <p>{status}</p>
        </div>
      )}
    </div>
  );
};

export default ApiTest; 