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

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await api.get('/auth/isLoggedIn');
        if (data.loggedIn) {
          setLoggedIn(true);
          setUser(data.user);
        } else {
          setLoggedIn(false);
          setUser(null);
        }
        if (data.user) {
          const contact = data.user.contacts;
          setContacts(Array.isArray(contact) ? contact : [contact]);
        } else {
          setError('Failed to load contacts');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  });
  const LinkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  return loggedIn ? (
    <div className='h-screen flex flex-col bg-gray-50 text-gray-800'>
      {/* Navbar */}
      <header className='flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm'>
        <h1 className='text-xl font-semibold text-blue-600'>Contacts</h1>
        <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'>
          <FiPlus />
          Add Contact
        </button>
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

          <div className='bg-white rounded-lg shadow-sm border'>
            <table className='min-w-full text-sm'>
              <thead className='bg-gray-100 text-gray-600'>
                <tr>
                  <th className='text-left px-6 py-3 font-medium'>Name</th>
                  <th className='text-left px-6 py-3 font-medium'>Email</th>
                  <th className='text-left px-6 py-3 font-medium'>Phone</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  ) : (
    <>
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <h1 className='text-6xl font-bold mb-4'>Contact Mangagement System</h1>
        <p className='text-xl mb-5'>Login or Regiser to use the contacts</p>
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
