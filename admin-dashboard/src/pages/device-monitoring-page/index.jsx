import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

const apiDomain = import.meta.env.VITE_API_DOMAIN;

export default function DeviceMonitoring() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${apiDomain}/api/events`, {
          credentials: 'include'
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const nextData = await res.json();
        setData(nextData);
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchData();
  }, []);


  return (
    <div className={styles.container}>
      <h1>Device Monitoring</h1>
      <table className={styles.table}>
        <thead>
        <tr>
          <th>ID</th>
          <th>Fingerprint ID</th>
          <th>IP</th>
          <th>Created At</th>
        </tr>
        </thead>
        <tbody>
        {data?.map(el => (
          <tr key={el.id} className={styles.row}>
            <td className={styles.cell}>{el.id}</td>
            <td className={styles.cell}>{el.fingerprint_id}</td>
            <td className={styles.cell}>{el.ip}</td>
            <td className={styles.cell}>{el.created_at}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
