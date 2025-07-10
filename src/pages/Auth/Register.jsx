import React from 'react';
import { useForm } from 'react-hook-form';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { createUser, loading, setLoading } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // 1. Upload profile picture to Imgbb
      const image = data.profilePicture[0];
      const formData = new FormData();
      formData.append('image', image);

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: formData,
      });
      const imgbbData = await imgbbRes.json();
      if (!imgbbData.success) throw new Error('Image upload failed');
      const photoURL = imgbbData.data.url;

      // 2. Create user with Firebase using AuthProvider's createUser
      const userCredential = await createUser(data.email, data.password);

      // 3. Update Firebase profile
      await updateProfile(userCredential.user, {
        displayName: data.fullName,
        photoURL,
      });

      // 4. Save user info to backend
      await axiosInstance.post('/users', {
        name: data.fullName,
        email: data.email,
        photoURL,
      });

      toast.success('Registration successful!');
      reset();
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-600">Register</h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
            {...register('fullName', { required: 'Full Name is required' })}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: value =>
                value === watch('password') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Profile Picture */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 px-3 py-2"
            {...register('profilePicture', {
              required: 'Profile picture is required',
              validate: fileList =>
                fileList.length > 0 && fileList[0].type.startsWith('image/')
                  ? true
                  : 'Please upload a valid image file',
            })}
          />
          {errors.profilePicture && <p className="text-red-500 text-sm mt-1">{errors.profilePicture.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600 transition font-semibold"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;