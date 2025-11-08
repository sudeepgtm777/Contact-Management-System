import React, { useState } from 'react';
import api from '../utils/axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/login', {
        email,
        password,
      });

      window.location.href = '/';
    } catch (err) {
      setError(err.message || '⚠️ Login failed');
    }
  };

  return (
    <main className='main flex justify-center items-center min-h-screen bg-gray-50'>
      <div className='login-form bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='heading-secondary text-2xl font-bold mb-6 text-center'>
          Log into your account
        </h2>

        <form className='form form--login space-y-4' onSubmit={handleSubmit}>
          <div className='form__group'>
            <label className='form__label block mb-1' htmlFor='email'>
              Email address
            </label>
            <input
              id='email'
              type='email'
              placeholder='Your email@.com'
              className='form__input w-full px-3 py-2 border rounded-md'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='form__group'>
            <label className='form__label block mb-1' htmlFor='password'>
              Password
            </label>
            <input
              id='password'
              type='password'
              placeholder='••••••••'
              className='form__input w-full px-3 py-2 border rounded-md'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength='8'
              required
            />
          </div>

          <div className='form__group'>
            <button
              type='submit'
              className='btn btn--violet w-full py-2 rounded-md text-white bg-violet-600 hover:bg-violet-700 transition'
            >
              Login
            </button>
          </div>

          {error && (
            <p className='mt-4 text-center text-red-600 font-medium'>{error}</p>
          )}
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
