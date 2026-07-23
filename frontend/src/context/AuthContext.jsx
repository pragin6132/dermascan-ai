import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
console.log("API URL =", import.meta.env.VITE_API_URL);
console.log("Axios Base URL =", axios.defaults.baseURL);
axios.defaults.baseURL = "https://dermascan-backend-86eu.onrender.com";
// Setup base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL;// Handled by Vite dev server proxy

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize: check token & theme on mount
  useEffect(() => {
    const initializeApp = async () => {
      // 1. Theme initialization
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }

      // 2. Auth initialization
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/api/auth/profile');
          setUser(res.data);
          console.log('[AUTH] Persistent session verified successfully');
        } catch (error) {
          console.warn('[AUTH] Session token expired or invalid, cleaning token headers.');
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeApp();
  }, []);

  // Theme Toggle Handler
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  // Sign Up Handler
  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/signup', { name, email, password });
      const { token, ...userData } = res.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('[AUTH] Signup failed:', error.response?.data?.message || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to complete signup registration.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Login Handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, ...userData } = res.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('[AUTH] Login failed:', error.response?.data?.message || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid email credentials or password.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout Handler
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    console.log('[AUTH] User session logged out successfully.');
  };

  const value = {
    user,
    loading,
    darkMode,
    toggleTheme,
    signup,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be utilized within an AuthProvider node.');
  }
  return context;
};
