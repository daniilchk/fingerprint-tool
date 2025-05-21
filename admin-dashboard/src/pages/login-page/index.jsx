import React, { useState, useEffect } from 'react';
import { useAuth } from "../../providers/auth-provider.jsx";
import { useNavigate } from "react-router-dom";
import styles from './styles.module.css';

export default function LoginPage() {
  const { config, login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    login(username, password);
  };

  useEffect(() => {
    if (config) {
      nav('/', { replace: true });
    }
  }, [config, nav]);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h2 className={styles.title}>Sign In</h2>
        <input
          className={styles.input}
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className={styles.button} type="submit">Login</button>
      </form>
    </div>
  );
}
