import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in
  const [currentPage, setCurrentPage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('app-theme') || 'dark';
  });

  const login = (role) => {
    if (role === 'cliente') {
      setUser({ name: 'María García', role: 'cliente', avatar: 'MG', email: 'maria.garcia@mail.com' });
      setCurrentPage('catalogo');
    } else {
      setUser({ name: 'Carlos Rodríguez', role: 'admin', avatar: 'CR', email: 'c.rodriguez@pastafab.com' });
      setCurrentPage('clientes');
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentPage(null);
  };

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const nextMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme', nextMode);
      return nextMode;
    });
  };

  return (
    <AppContext.Provider value={{ user, currentPage, sidebarOpen, themeMode, login, logout, navigate, toggleSidebar, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
