import React, { useState } from 'react';
import api from '../utils/axios';
import { useSearchParams } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match!');
    }

    try {
      await api.post('/auth/reset-password', {
        token,
        password,
        confirmPassword,
      });

      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/sign-in';
      }, 2000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <main className='main flex justify-center items-center min-h-screen bg-gray-50'>
      <div className='login-form bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='heading-secondary text-2xl font-bold mb-6 text-center'>
          Reset Your Password
        </h2>

        <form className='form form--reset space-y-4' onSubmit={handleSubmit}>
          <div className='form__group'>
            <label className='form__label block mb-1' htmlFor='password'>
              New Password
            </label>
            <input
              id='password'
              type='password'
              placeholder='••••••••'
              className='form__input w-full px-3 py-2 border rounded-md'
              minLength='8'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className='form__group'>
            <label className='form__label block mb-1' htmlFor='confirmPassword'>
              Confirm Password
            </label>
            <input
              id='confirmPassword'
              type='password'
              placeholder='••••••••'
              className='form__input w-full px-3 py-2 border rounded-md'
              minLength='8'
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className='form__group'>
            <button
              type='submit'
              className='btn btn--violet w-full py-2 rounded-md text-white bg-violet-600 hover:bg-violet-700 transition'
            >
              Reset Password
            </button>
          </div>

          {error && (
            <p className='mt-4 text-center text-red-600 font-medium'>{error}</p>
          )}

          {success && (
            <p className='mt-4 text-center text-green-600 font-medium'>
              {success}
            </p>
          )}
        </form>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
