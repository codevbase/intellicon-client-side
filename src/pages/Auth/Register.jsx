import React from 'react';
import { useForm } from 'react-hook-form';
import { updateProfile } from 'firebase/auth';
import { Link, useLocation, useNavigate } from 'react-router';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import imageCompression from 'browser-image-compression';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';
import axios from 'axios';
import { DEFAULT_USER_BADGE, BADGE_DESCRIPTIONS } from '../../constants/roles';
import { Helmet } from 'react-helmet-async';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const Register = () => {
    const location = useLocation();
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const { createUser, loading, setLoading, signInWithGoogle } = useAuth();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Validate email format before proceeding
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Trim whitespace from email
            const cleanEmail = data.email.trim().toLowerCase();

            // Step 1: Compress the uploaded image
            const image = data.profilePicture[0];
            const options = {
                maxWidthOrHeight: 300,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(image, options);

            // Step 2: Upload to Cloudinary using axios
            const formData = new FormData();
            formData.append('file', compressedFile);
            formData.append('upload_preset', uploadPreset);

            const cloudinaryRes = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const cloudinaryData = cloudinaryRes.data;
            if (!cloudinaryData.secure_url) {
                throw new Error('Image upload failed');
            }

            const photoURL = cloudinaryData.secure_url;

            // Step 3: Create Firebase user with cleaned email
            const userCredential = await createUser(cleanEmail, data.password);

            // Step 4: Update Firebase profile
            await updateProfile(userCredential.user, {
                displayName: data.fullName,
                photoURL,
            });

            // Step 5: Save user info to backend
            const saveUser = {
                name: data.fullName,
                email: cleanEmail,
                photoURL,
                role: 'user',
            };

            try {
                await axiosInstance.post('/users', saveUser);
            } catch (backendError) {
                if (backendError.response && backendError.response.status === 409) {
                    // User already exists in backend, continue
                    console.log('User already exists in backend, continuing...');
                } else {
                    throw new Error('Failed to save user data');
                }
            }

            // Step 6: Success feedback and navigation
            const badgeDescription = BADGE_DESCRIPTIONS[DEFAULT_USER_BADGE];
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Registration successful!',
                text: `Welcome! You've been assigned the "${DEFAULT_USER_BADGE}" badge. ${badgeDescription}`,
                showConfirmButton: false,
                timer: 3000
            });
            reset();
            navigate('/dashboard');
        } catch (err) {
            // Provide specific error messages based on error codes
            let errorMessage = 'Registration failed!';

            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists.';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters long.';
            } else if (err.code === 'auth/operation-not-allowed') {
                errorMessage = 'Email/password accounts are not enabled. Please contact support.';
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await signInWithGoogle();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Signed up with Google',
                showConfirmButton: false,
                timer: 1500
            });
            navigate(location?.state?.from?.pathname || '/');
        } catch (error) {
            toast.error('Google signup failed!', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Helmet>
            <title>Register - IntelliCon Forum</title>
        </Helmet>
            <div className="card bg-green-200 w-full mx-auto max-w-md shrink-0 shadow-2xl my-5 pb-10 ">
                <div className="card-body">
                    {/* Registration Form */}
                    <form
                        className="p-8 rounded-lg w-full max-w-md border border-cyan-400"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-700">Register</h2>

                        {/* Full Name */}
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-cyan-600">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border-none bg-green-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                {...register('fullName', { required: 'Full Name is required' })}
                            />
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-cyan-700">Email</label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border-none bg-green-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Please enter a valid email address',
                                    },
                                    validate: (value) => {
                                        const trimmedValue = value.trim();
                                        if (trimmedValue.length === 0) {
                                            return 'Email cannot be empty';
                                        }
                                        if (trimmedValue.length > 254) {
                                            return 'Email is too long';
                                        }
                                        return true;
                                    }
                                })}
                                placeholder="Enter your email address"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-cyan-700">Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border-none bg-green-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                            <label className="block mb-1 font-medium text-cyan-700">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border-none bg-green-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                            <label className="block mb-1 font-medium text-cyan-700">Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full px-3 py-2 border-none bg-green-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
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

                    <span className='text-center text-xl text-cyan-700'>or</span>
                    {/* Google button outside the form */}
                    <button
                        type="button"
                        className="btn btn-outline btn-primary flex items-center justify-center gap-2 mt-1"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <FcGoogle size={22} />
                        Continue with Google
                    </button>
                    <p>Already have an account? Please <Link className="text-blue-400 underline" to="/join-us">Join us</Link></p>
                </div>
            </div>
        </>
    );
};

export default Register;