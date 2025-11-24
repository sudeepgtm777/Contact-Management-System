import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { UserContext } from '../context/UserContext.jsx';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const AccountPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loadingSettings, setLoadingSettings] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/isLoggedIn');
        if (data.loggedIn) {
          setUser(data.user);
          setName(data.user.name);
        }
      } catch (err) {
        console.error('Error loading user', err);
      }
    };

    fetchUser();
  }, []);

  // Update name + photo
  const handleUserUpdate = async (e) => {
    e.preventDefault();
    setLoadingSettings(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      if (photo) formData.append('photo', photo);

      const { data } = await api.patch('/users/updateMe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser(data.user);
      setPreview(null);
      setPhoto(null);
      toast.success('Profile Updated!');
    } catch (err) {
      console.error('Update failed', err);
      toast.error('Update Failed!');
    } finally {
      setLoadingSettings(false);
    }
  };

  // Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);

    try {
      await api.patch('/auth/updateMyPassword', {
        passwordCurrent: currentPassword,
        password: newPassword,
        passwordConfirm: confirmPassword,
      });

      toast.success('Password updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password update failed', err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update password.';

      toast.error(message);
    } finally {
      setLoadingPassword(false);
    }
  };

  if (!user) return <div className='text-center text-xl mt-20'>Loading...</div>;

  return (
    <div className='max-w-3xl mx-auto mt-12 px-4'>
      {/* ACCOUNT SETTINGS */}
      <h2 className='text-3xl font-bold mb-6'>Your Account Settings</h2>

      {/* Name + Photo Form */}
      <form
        onSubmit={handleUserUpdate}
        className='bg-white p-6 rounded-lg shadow mb-12'
      >
        {/* Name */}
        <div className='mb-4'>
          <label className='block font-semibold mb-2'>Name</label>
          <input
            type='text'
            required
            className='w-full border rounded px-3 py-2'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Current / Preview Photo */}
        <div className='mb-4'>
          <label className='block font-semibold mb-2'>Photo</label>
          <img
            src={preview ? preview : `${BACKEND_URL}/users/${user.photo}`}
            alt='User'
            className='w-24 h-24 rounded-full object-cover border'
          />
        </div>

        {/* New Photo Upload */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Choose New Photo</label>
          <input
            type='file'
            accept='image/*'
            className='w-full'
            onChange={(e) => {
              const file = e.target.files[0];
              setPhoto(file);
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        <button
          type='submit'
          className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
          disabled={loadingSettings}
        >
          {loadingSettings ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      {/* Password Change */}
      <h2 className='text-3xl font-bold mb-6'>Password Change</h2>

      <form
        onSubmit={handlePasswordUpdate}
        className='bg-white p-6 rounded-lg shadow'
      >
        <div className='mb-4'>
          <label className='block font-semibold mb-2'>Current Password</label>
          <input
            type='password'
            required
            minLength='8'
            className='w-full border rounded px-3 py-2'
            placeholder='••••••••'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className='mb-4'>
          <label className='block font-semibold mb-2'>New Password</label>
          <input
            type='password'
            required
            minLength='8'
            className='w-full border rounded px-3 py-2'
            placeholder='••••••••'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Confirm Password</label>
          <input
            type='password'
            required
            minLength='8'
            className='w-full border rounded px-3 py-2'
            placeholder='••••••••'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type='submit'
          className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
          disabled={loadingPassword}
        >
          {loadingPassword ? 'Saving...' : 'Save Password'}
        </button>
      </form>
    </div>
  );
};

export default AccountPage;
