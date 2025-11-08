import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import api from '../utils/axios.js';

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check login state on mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const { data } = await api.get('/auth/isLoggedIn');

        if (data.loggedIn) {
          setLoggedIn(true);
          setUser(data.user);
        } else {
          setLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        setLoggedIn(false);
        setUser(null);
        console.error('Error checking login', err);
      }
    };

    checkLogin();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await api.get('/auth/logout');

      setLoggedIn(false);
      setUser(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const LinkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  return (
    <nav className='bg-indigo-700 border-b border-indigo-500'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/'>
              <span className='hidden md:block text-white text-2xl font-bold ml-2'>
                Contact Management System
              </span>
            </NavLink>
            <div className='md:ml-auto'>
              <div className='flex space-x-2'>
                <NavLink to='/' className={LinkClass}>
                  Home
                </NavLink>

                {loggedIn ? (
                  <>
                    {/* Show first name */}
                    <span className='bg-green-500 hover:bg-green-700 text-white rounded-md px-3 py-2 cursor-pointer'>
                      {user?.name?.split(' ')[0]}
                    </span>
                    {/* Sign out button */}
                    <button
                      onClick={handleLogout}
                      className={LinkClass({ isActive: false })}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to='/sign-up' className={LinkClass}>
                      Sign Up
                    </NavLink>
                    <NavLink to='/sign-in' className={LinkClass}>
                      Login
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
