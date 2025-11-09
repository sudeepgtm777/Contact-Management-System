import React from 'react';
import { Route, Routes } from 'react-router';
import { HomePage } from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignupPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='*' element={<NotFoundPage />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-in' element={<LoginPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
