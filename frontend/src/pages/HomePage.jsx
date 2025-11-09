import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import api from '../utils/axios.js';
import { Link } from 'react-router';

export const HomePage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterProperty, setFilterProperty] = useState('');

  const fetchContacts = async (search = '', filter = '') => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/isLoggedIn');
      if (!data.loggedIn) {
        setLoggedIn(false);
        setUser(null);
        setError('You are not logged in');
        return;
      }

      setLoggedIn(true);
      setUser(data.user);

      // Build query string properly
      let query = '/contacts/user?page=1&limit=10';
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (filter) query += `&property_type=${encodeURIComponent(filter)}`;

      const contactsRes = await api.get(query);
      const contact = contactsRes.data.data.contacts;
      setContacts(Array.isArray(contact) ? contact : [contact]);
    } catch (err) {
      console.error(err);
      setError('Error fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  //  Trigger search when form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchContacts(searchQuery, filterProperty);
  };

  return loggedIn ? (
    <div className='h-screen flex flex-col bg-gray-50 text-gray-800'>
      {/* Navbar */}
      <header className='flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm'>
        <h1 className='text-xl font-semibold text-blue-600'>Contacts</h1>
        <Link
          to='/add-contact'
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'
        >
          <FiPlus />
          Add Contact
        </Link>
      </header>

      {/* Main Content */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <aside className='w-64 bg-white border-r p-4 hidden md:block'>
          <nav className='space-y-2'>
            <button className='w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 text-blue-600 font-medium'>
              All Contacts
            </button>
          </nav>
        </aside>

        {/* Contacts List */}
        <main className='flex-1 overflow-y-auto p-6'>
          <h2 className='text-lg font-semibold mb-4'>All Contacts</h2>

          {/*  Search and Filter Section */}
          <form
            onSubmit={handleSubmit}
            className='flex flex-col md:flex-row gap-4 mb-6'
          >
            <input
              type='text'
              placeholder='Search by name, email, or phone...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
            />

            <select
              value={filterProperty}
              onChange={(e) => setFilterProperty(e.target.value)}
              className='px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
            >
              <option value=''>All Properties</option>
              <option value='Residential'>Residential</option>
              <option value='Commercial'>Commercial</option>
            </select>

            <button
              type='submit'
              className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
            >
              Search
            </button>
          </form>

          {/* 🔹 Contacts Table */}
          <div className='bg-white rounded-lg shadow-sm border'>
            {loading ? (
              <p className='p-4 text-center'>Loading...</p>
            ) : error ? (
              <p className='p-4 text-red-500 text-center'>{error}</p>
            ) : contacts.length === 0 ? (
              <p className='p-4 text-center text-gray-500'>
                No contacts found.
              </p>
            ) : (
              <table className='min-w-full text-sm'>
                <thead className='bg-gray-100 text-gray-600'>
                  <tr>
                    <th className='text-left px-6 py-3 font-medium'>Name</th>
                    <th className='text-left px-6 py-3 font-medium'>Email</th>
                    <th className='text-left px-6 py-3 font-medium'>Phone</th>
                    <th className='text-left px-6 py-3 font-medium'>
                      Property Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className='border-t hover:bg-gray-50 transition'
                    >
                      <td className='px-6 py-3 flex items-center gap-3'>
                        <img
                          src={`/users/${contact.user_logo}`}
                          alt={contact.user_name}
                          className='w-10 h-10 rounded-full object-cover'
                        />
                        <span className='font-medium'>{contact.user_name}</span>
                      </td>
                      <td className='px-6 py-3 text-gray-600'>
                        {contact.user_email}
                      </td>
                      <td className='px-6 py-3 text-gray-600'>
                        {contact.user_phone}
                      </td>
                      <td className='px-6 py-3 text-gray-600'>
                        {contact.property_type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  ) : (
    <>
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <h1 className='text-6xl font-bold mb-4'>Contact Management System</h1>
        <p className='text-xl mb-5'>Login or Register to use the contacts</p>
        <div className='flex gap-4'>
          <Link
            to='/sign-up'
            className='text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4'
          >
            Sign Up
          </Link>
          <Link
            to='/sign-in'
            className='text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4'
          >
            Log In
          </Link>
        </div>
      </section>
    </>
  );
};
