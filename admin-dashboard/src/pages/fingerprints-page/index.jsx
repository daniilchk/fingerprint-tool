import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const apiDomain = import.meta.env.VITE_API_DOMAIN;

export default function Fingerprints() {
  const [fingerprints, setFingerprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${apiDomain}/api/fingerprints`, {
          credentials: 'include'
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setFingerprints(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.message}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fingerprints</h1>
      <table className={styles.table}>
        <thead>
        <tr>
          <th>ID</th>
          <th>Hash</th>
          <th>Risk Score</th>
          <th>Created At</th>
        </tr>
        </thead>
        <tbody>
        {fingerprints?.map(fp => (
          <tr key={fp.id} className={styles.row}>
            <td className={styles.cell}>{fp.id}</td>
            <td className={styles.cell}>{fp.hash}</td>
            <td className={styles.cell}>{fp.risk_score ?? 0}</td>
            <td className={styles.cell}>{fp.created_at}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
