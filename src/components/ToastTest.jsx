import React from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ToastTest = () => {
  const testToast = () => {
    console.log('Testing toast...');
    toast.success('This is a success toast!');
    toast.error('This is an error toast!');
    toast.info('This is an info toast!');
  };

  const testSweetAlert = () => {
    console.log('Testing SweetAlert...');
    Swal.fire({
      title: 'Test SweetAlert',
      text: 'This is a test SweetAlert!',
      icon: 'success',
      confirmButtonText: 'Cool'
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Toast and SweetAlert Test</h2>
      <div className="space-x-4">
        <button 
          onClick={testToast}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Toast
        </button>
        <button 
          onClick={testSweetAlert}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test SweetAlert
        </button>
      </div>
    </div>
  );
};

export default ToastTest; 