import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../utils/axios';

const AddContactPage = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_logo: 'default.jpg',
    user_email: '',
    user_phone: '',
    property_type: 'Residential',
    properties: '',
    company: '',
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phone, setPhone] = useState('+977');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    if (!value.startsWith('+977')) {
      value = '+977' + value.replace(/^\+977/, '');
    }

    setPhone(value);
    setFormData({ ...formData, user_phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await api.post('/contacts', formData);
      setSuccess('Contact added successfully!');
      setFormData({
        user_name: '',
        user_logo: '',
        user_email: '',
        user_phone: '',
        property_type: 'Residential',
        properties: '',
        company: '',
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding contact.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Add New Contact</h2>

      {error && <p className='mb-4 text-red-500 font-semibold'>{error}</p>}
      {success && (
        <p className='mb-4 text-green-500 font-semibold'>{success}</p>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block mb-1 font-medium'>Name</label>
          <input
            type='text'
            name='user_name'
            value={formData.user_name}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>Email</label>
          <input
            type='email'
            name='user_email'
            value={formData.user_email}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>
            Phone (+977XXXXXXXXXX)
          </label>
          <input
            type='text'
            name='user_phone'
            value={phone}
            onChange={handlePhoneChange}
            required
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>Property Type</label>
          <select
            name='property_type'
            value={formData.property_type}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
          >
            <option value='Residential'>Residential</option>
            <option value='Commercial'>Commercial</option>
          </select>
        </div>

        <div>
          <label className='block mb-1 font-medium'>Properties</label>
          <input
            type='text'
            name='properties'
            value={formData.properties}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>Company</label>
          <input
            type='text'
            name='company'
            value={formData.company}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Adding...' : 'Add Contact'}
        </button>
      </form>
    </div>
  );
};

export default AddContactPage;
