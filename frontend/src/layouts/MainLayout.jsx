import React from 'react';
import { Outlet } from 'react-router';
import NavBar from '../components/Navbar';

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default MainLayout;
