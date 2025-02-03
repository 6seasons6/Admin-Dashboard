
import React, { createContext, useContext, useState } from 'react';

// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({ token: null, user: null });


  // Function to log out user
  const logout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    setAuthData({ token: null, user: null }); // Clear auth state
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthData, logout }}>

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Automatically validate the token on app load
      axios.get('/api/validate', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setAuthData({ token, user: res.data }))
        .catch((err) => console.error(err));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setAuthData({ token: res.data.token, user: res.data.user });
    } catch (error) {
      console.error("Login failed:", error.response.data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthData({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthData, login, logout }}>

      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
