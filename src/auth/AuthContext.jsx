// src/auth/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    name: null,
    role: null,
    permissions: []
  });

  const login = (credentials) => {
    // Implement login logic
  };

  const logout = () => {
    setUser({ id: null, name: null, role: null, permissions: [] });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);