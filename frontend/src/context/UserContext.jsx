import { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch logged-in user once
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/isLoggedIn');
        if (data.loggedIn) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
