import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.css';

export default function Navigation({ onLogout }) {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  const handleLogout = () => {
    onLogout();
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>Admin Panel</div>
      <button className={styles.toggle} onClick={toggleMenu} aria-label="Toggle menu">
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>
      <div className={`${styles.links} ${open ? styles.open : ''}`}>
        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink>
        <NavLink to="/fingerprints" className={({ isActive }) => isActive ? styles.active : ''}>Fingerprints</NavLink>
        <NavLink to="/monitoring" className={({ isActive }) => isActive ? styles.active : ''}>Device Monitoring</NavLink>
        <button className={styles.logout} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
