import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignupPage';
import AddContactPage from './pages/AddContactPage';
import EditContactPage from './pages/EditContactPage';
import AccountPage from './pages/AccountPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='add-contact' element={<AddContactPage />} />
          <Route path='edit-contact/:id' element={<EditContactPage />} />
          <Route path='*' element={<NotFoundPage />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-in' element={<LoginPage />} />
          <Route path='/account' element={<AccountPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
