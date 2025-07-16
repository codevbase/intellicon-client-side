import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  const amount = 10; // $10 membership fee

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    // 1. Create PaymentIntent from backend
    const { data } = await axiosInstance.post('/create-payment-intent', { amount });
    const clientSecret = data.clientSecret;

    // 2. Confirm Card Payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setSuccess('Payment successful!');
        // Update user to "member" in your backend
        if (user?.email) {
          try {
            await axiosInstance.patch(`/users/${user.email}`, { badge: 'gold' });
            toast.success('Membership activated! You are now a Gold member.');
            navigate('/dashboard');
          } catch {
            toast.error('Failed to update membership badge.');
          }
        }
      }
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <CardElement className="border p-4 rounded mb-4" />
      <button type="submit" disabled={!stripe || processing} className="btn btn-primary">
        Pay ${amount}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </form>
  );
};

export default CheckoutForm;
