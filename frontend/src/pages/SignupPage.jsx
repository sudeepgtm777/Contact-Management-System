import React, { useState } from 'react';
import api from '../utils/axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/auth/register', formData);
      console.log('Signup response:', res.data);

      setMessage({
        type: 'success',
        text: 'Account created! Redirecting...',
      });

      setTimeout(() => (window.location.href = '/'), 1200);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || ' Something went wrong!',
      });
    }

    setLoading(false);
  };

  return (
    <main className='main flex justify-center items-center min-h-screen bg-gray-50'>
      <div className='signup-form bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='heading-secondary text-2xl font-bold text-center mb-6'>
          Create your account
        </h2>

        <form className='form form--signup space-y-4' onSubmit={handleSubmit}>
          <div className='form__group'>
            <label className='form__label block mb-1' htmlFor='name'>
              Your name
            </label>
            <input
              id='name'
              className='form__input w-full px-3 py-2 border rounded-md'
              type='text'
              name='name'
              placeholder='Enter Your name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form__group'>
            <label className='form__label block mb-1' htmlFor='email'>
              Email address
            </label>
            <input
              id='email'
              className='form__input w-full px-3 py-2 border rounded-md'
              type='email'
              name='email'
              placeholder='Your email.com'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form__group'>
            <label className='form__label block mb-1' htmlFor='password'>
              Password
            </label>
            <input
              id='password'
              className='form__input w-full px-3 py-2 border rounded-md'
              type='password'
              name='password'
              placeholder='••••••••'
              value={formData.password}
              onChange={handleChange}
              minLength='8'
              required
            />
          </div>

          <div className='form__group'>
            <label className='form__label block mb-1' htmlFor='passwordConfirm'>
              Confirm password
            </label>
            <input
              id='passwordConfirm'
              className='form__input w-full px-3 py-2 border rounded-md'
              type='password'
              name='passwordConfirm'
              placeholder='••••••••'
              value={formData.passwordConfirm}
              onChange={handleChange}
              minLength='8'
              required
            />
          </div>

          <div className='form__group'>
            <button
              className='btn btn--viloet w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition'
              type='submit'
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        {message.text && (
          <p
            className={`mt-4 text-center font-medium ${
              message.type === 'error' ? 'text-red-600' : 'text-violet-600'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </main>
  );
};

export default SignUp;
