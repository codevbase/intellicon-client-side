import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
// import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import axiosSecure from '../../api/axiosSecure';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { Helmet } from 'react-helmet-async';

const Membership = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  // Example payment handler (replace with real payment integration)
  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment success (replace with actual payment logic)
      // After payment, update user badge in backend
      const res = await axiosSecure.post('/create-payment-intent', { email: user.email });
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: res.data.id });
      await axiosSecure.patch(`/users/${user.email}`, {
        badge: 'gold'
      });
      toast.success('Membership activated! You are now a Gold member.');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Payment failed. Please try again.', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Membership - IntelliCon Forum</title>
      </Helmet>
      <div className="max-w-lg mx-auto bg-white p-8 rounded shadow mt-10">
        <h2 className="text-2xl font-bold mb-4 text-cyan-700">Become a Member</h2>
        <p className="mb-6 text-gray-700">
          Pay <span className="font-bold text-cyan-600">$10</span> to become a member of IntelliCon.
          As a Gold member, you can make unlimited posts and receive a Gold badge!
        </p>
        <button
          className="w-full bg-yellow-500 text-white py-2 rounded font-semibold hover:bg-yellow-600 transition"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay & Become Gold Member'}
        </button>
        <Elements stripe={stripePromise}>
          {/* Include your CheckoutForm component here if needed */}
          <CheckoutForm />
        </Elements>
        <p className="mt-4 text-sm text-gray-500">
          By becoming a member, you agree to our <a href="/terms" className="text-blue-500">Terms of Service</a>.
        </p>
      </div>
    </>
  );
};

export default Membership;