import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

import { AuthContext } from './AuthContextValue';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  useEffect(() => {
    // If we have a token but no user, try to fetch user profile
    const fetchUser = async () => {
      try {
        if (token) {
          const { data } = await api.get('/users/profile');
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [token]);

  // WebSocket Connection Management
  useEffect(() => {
    let newSocket;
    if (user && !socket) {
      newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      
      newSocket.on('connect', () => {
        newSocket.emit('register', user._id);
      });

      newSocket.on('notification', (data) => {
        if (data.type === 'success') toast.success(data.message);
        else if (data.type === 'error') toast.error(data.message);
        else toast.info(data.message);
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [user, socket]);

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const registerUser = async (userData) => {
    const { data } = await api.post('/users/register', userData);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const updateUserContext = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, registerUser, logout, socket, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};
