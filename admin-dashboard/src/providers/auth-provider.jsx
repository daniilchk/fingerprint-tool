import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;
const api_domain = import.meta.env.VITE_API_DOMAIN;
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    axios.get(`${api_domain}/api/me`)
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username, password) => {
    await axios.post(`${api_domain}/auth/login`, { username, password });
    const { data } = await axios.get('/api/me');
    setUser(data);
    nav('/');
  };

  const logout = async () => {
    await axios.post(`${api_domain}/auth/logout`);
    setUser(null);
    nav('/login');
  };

  if (isLoading) {
    return <div>Loading</div>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
