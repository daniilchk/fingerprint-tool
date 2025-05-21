import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from "../components/loader/index.jsx";

axios.defaults.withCredentials = true;
const api_domain = import.meta.env.VITE_API_DOMAIN;
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    axios.get(`${api_domain}/api/config`)
      .then(res => setConfig(res.data.data))
      .catch(() => setConfig(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username, password) => {
    await axios.post(`${api_domain}/auth/login`, { username, password });
    const { data } = await axios.get('/config');
    setConfig(data.data);
    nav('/');
  };

  const logout = async () => {
    await axios.post(`${api_domain}/auth/logout`);
    setConfig(null);
    nav('/login');
  };

  if (isLoading) {
    return <Loader />
  }

  return (
    <AuthContext.Provider value={{ config, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
