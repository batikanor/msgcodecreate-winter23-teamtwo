import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in when the app loads
    const token = localStorage.getItem('userToken');
    if (token) {
        setIsAuthenticated(true);
    }
  }, []); // Empty dependency array means this effect runs only on mount

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        {console.log("AuthProvider: isAuthenticated", isAuthenticated)}
        {children}
    </AuthContext.Provider>
  );
};