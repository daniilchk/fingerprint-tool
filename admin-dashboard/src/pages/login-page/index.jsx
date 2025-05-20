import React, { useState, useEffect } from 'react';
import { useAuth } from "../../providers/auth-provider.jsx";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    login(username, password);
  };

  useEffect(() => {
    if (user) {
      nav('/dashboard', { replace: true });
    }
  }, [user, nav]);

  return (
    <form onSubmit={onSubmit}>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
