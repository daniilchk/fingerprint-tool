import React, { useState, useEffect } from 'react';
import { useAuth } from "../../providers/auth-provider.jsx";
import axios from 'axios';
import styles from './styles.module.css';

const apiDomain = import.meta.env.VITE_API_DOMAIN;

export default function Dashboard() {
  const { config: initialConfig } = useAuth();
  const [config, setConfig] = useState(initialConfig || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setConfig(initialConfig || []);
  }, [initialConfig]);

  const handleToggle = (criterionId) => {
    setConfig(cfg =>
      cfg.map(item =>
        item.criterion_id === criterionId
          ? { ...item, is_enabled: !item.is_enabled }
          : item
      )
    );
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await axios.post(`${apiDomain}/config`, config);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
          <tr>
            <th>ID</th>
            <th>Criterion</th>
            <th>Enabled</th>
            <th>Modified At</th>
          </tr>
          </thead>
          <tbody>
          {config.sort((a, b) => Number(a.id) - Number(b.id)).map(item => (
            <tr key={item.criterion_id}>
              <td data-label="ID">{item.criterion_id}</td>
              <td data-label="Criterion">{item.criterion_name.replace(/_/g, ' ').toUpperCase()}</td>
              <td data-label="Enabled">
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={item.is_enabled}
                  onChange={() => handleToggle(item.criterion_id)}
                />
              </td>
              <td data-label="Modified At">
                {new Date(item.modified_at).toLocaleString()}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <span>Threshold for Access Denied</span>
      <input
        className={styles.input}
        value={60}
      />
      <button
        className={styles.button}
        onClick={handleUpdate}
        disabled={isSaving}
      >
        {isSaving ? 'Saving…' : 'Update Config'}
      </button>
    </div>
  );
}
