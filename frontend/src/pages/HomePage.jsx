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
  const [page, setPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const limit = 5;

  const fetchContacts = async (search = '', filter = '', pageNum = 1) => {
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

      // Build query
      let query = `/contacts/user?page=${pageNum}&limit=${limit}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (filter) query += `&property_type=${encodeURIComponent(filter)}`;

      const contactsRes = await api.get(query);
      const contacts = contactsRes.data.data.contacts || [];
      const total =
        contactsRes.data.totalContacts || contactsRes.data.results || 0;

      setContacts(Array.isArray(contacts) ? contacts : [contacts]);
      setTotalContacts(total || 0);
    } catch (err) {
      console.error(err);
      setError('Error fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(searchQuery, filterProperty, page);
  }, [page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search/filter
    fetchContacts(searchQuery, filterProperty, 1);
  };

  const handleNext = () => {
    if (page * limit < totalContacts) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const totalPages = Math.ceil(totalContacts / limit);

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

      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <aside className='w-64 bg-white border-r p-4 hidden md:block'>
          <nav className='space-y-2'>
            <button className='w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 text-blue-600 font-medium'>
              All Contacts
            </button>
          </nav>
        </aside>

        {/* Main Section */}
        <main className='flex-1 overflow-y-auto p-6'>
          <h2 className='text-lg font-semibold mb-4'>All Contacts</h2>

          {/* Search & Filter */}
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

          {/* Contacts Table */}
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
              <>
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
                          <span className='font-medium'>
                            {contact.user_name}
                          </span>
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

                {/*  Pagination Controls */}
                <div className='flex justify-between items-center p-4 border-t bg-gray-50'>
                  <button
                    onClick={handlePrevious}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md ${
                      page === 1
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Previous
                  </button>

                  <p className='text-gray-700'>
                    Page {page} of {totalPages || 1}
                  </p>

                  <button
                    onClick={handleNext}
                    disabled={page * limit >= totalContacts}
                    className={`px-4 py-2 rounded-md ${
                      page * limit >= totalContacts
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
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
