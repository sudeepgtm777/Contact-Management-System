import React, { useEffect, useState } from 'react';
import api from '../utils/axios';

const EmailVerifiedPage = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const email = params.get('email');

      if (!token) {
        setStatus('failed');
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(
          `/auth/verify-email?token=${token}&email=${email}`
        );

        if (res.data.status === 'success') {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (err) {
        setStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();

    const timer = setTimeout(() => {
      window.location.href = '/sign-in';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <main className='flex justify-center items-center min-h-screen bg-gray-50'>
        <div className='bg-white p-8 rounded-lg shadow-md text-center max-w-md'>
          <h2 className='text-2xl font-bold mb-3 text-gray-600'>
            Verifying...
          </h2>
          <p className='text-gray-700 mb-4'>
            Please wait while we verify your email...
          </p>
        </div>
      </main>
    );
  }

  let title = '';
  let message = '';
  let color = 'green';

  if (status === 'success') {
    title = 'Email Verified!';
    message =
      'Your email has been successfully verified. Redirecting to login...';
    color = 'green';
  } else {
    title = 'Verification Failed';
    message = 'Link is invalid or expired. Redirecting to login...';
    color = 'red';
  }

  return (
    <main className='flex justify-center items-center min-h-screen bg-gray-50'>
      <div className='bg-white p-8 rounded-lg shadow-md text-center max-w-md'>
        <h2 className={`text-2xl font-bold mb-3 text-${color}-600`}>{title}</h2>
        <p className='text-gray-700 mb-4'>{message}</p>
        <p className='text-gray-500 text-sm'>
          Redirecting you to login page...
        </p>
      </div>
    </main>
  );
};

export default EmailVerifiedPage;
