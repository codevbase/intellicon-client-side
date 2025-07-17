import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // <-- make sure from react-router-dom
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { FcGoogle } from 'react-icons/fc';
import axiosInstance from '../../api/axiosInstance';
import { BADGE_DESCRIPTIONS } from '../../constants/roles';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { signInUser, loading, signInWithGoogle, user } = useAuth();

  // Redirect logged-in users away from login page
  useEffect(() => {
    if (!loading && user) {
      navigate(location?.state?.from?.pathname || '/dashboard', { replace: true });
    }
  }, [user, loading, navigate, location]);

  // Show loading spinner while auth state is loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInUser(data.email, data.password);
      const userInfo = userCredential.user;

      try {
        const response = await axiosInstance.post('/users', {
          name: userInfo.displayName || '',
          email: userInfo.email,
          photoURL: userInfo.photoURL || '',
          role: 'user',
        });

        if (response.data.success && response.data.user.badge) {
          const badgeDescription = BADGE_DESCRIPTIONS[response.data.user.badge];
          toast.success(`Login successful! Welcome back with your "${response.data.user.badge}" badge. ${badgeDescription}`);
        } else {
          toast.success('Login successful!');
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          toast.success('Login successful! Welcome back!');
        } else {
          throw error;
        }
      }

    //   navigate(location?.state?.from?.pathname || '/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed!');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithGoogle();
      const userInfo = userCredential.user;

      try {
        const response = await axiosInstance.post('/users', {
          name: userInfo.displayName || '',
          email: userInfo.email,
          photoURL: userInfo.photoURL || '',
          role: 'user',
        });

        if (response.data.success && response.data.user.badge) {
          const badgeDescription = BADGE_DESCRIPTIONS[response.data.user.badge];
          toast.success(`Signed in with Google! Welcome with your "${response.data.user.badge}" badge. ${badgeDescription}`);
        } else {
          toast.success('Signed in with Google!');
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          toast.success('Signed in with Google! Welcome back!');
        } else {
          throw error;
        }
      }

    //   navigate(location?.state?.from?.pathname || '/dashboard');
    } catch (error) {
      toast.error(error.message || 'Google sign-in failed!');
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - IntelliCon Forum</title>
      </Helmet>
      <div className="card bg-green-200 w-full mx-auto max-w-md shrink-0 shadow-2xl my-5 pb-10">
        <div className="card-body">
          <form
            className="p-8 rounded-lg w-full max-w-md border-cyan-400 border"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-cyan-600">Login</h2>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-1 font-medium text-cyan-700">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border-none bg-green-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
            <div className="mb-6">
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

            <button
              type="submit"
              className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600 transition font-semibold"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <span className="text-center text-xl block my-2 text-cyan-700">or</span>
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
          <p className="mt-4">
            Don't have an account?{' '}
            <Link className="text-blue-400 underline" to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
