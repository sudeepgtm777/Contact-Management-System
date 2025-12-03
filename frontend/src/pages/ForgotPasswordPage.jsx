import React, { useState } from 'react';
import api from '../utils/axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await api.post('/auth/forgot-password', { email });

      setMessage(res.data.message || 'Password reset email sent!');

      setTimeout(() => (window.location.href = '/sign-in'), 1000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Try again.');
      }
    }
  };

  return (
    <main className='main flex justify-center items-center min-h-screen bg-gray-50'>
      <div className='forgot-form bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='heading-secondary text-2xl font-bold mb-6 text-center'>
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='form__group'>
            <label className='block mb-1 font-medium' htmlFor='email'>
              Email address
            </label>
            <input
              id='email'
              type='email'
              placeholder='your@email.com'
              className='w-full px-3 py-2 border rounded-md'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            className='w-full py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition'
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className='mt-4 text-green-600 text-center font-medium'>
            {message}
          </p>
        )}

        {error && (
          <p className='mt-4 text-red-600 text-center font-medium'>{error}</p>
        )}

        <div className='text-center mt-4'>
          <a
            href='/login'
            className='text-violet-600 text-sm hover:text-violet-700'
          >
            Back to login
          </a>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
