import React, { createContext, useContext, useState } from 'react';

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
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
