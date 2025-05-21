import React from 'react';
import styles from './styles.module.css';

export default function Loader() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
    </div>
  );
}
