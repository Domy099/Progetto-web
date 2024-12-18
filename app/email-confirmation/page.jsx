"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const EmailConfirmation = () => {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Conferma dell'Account</h1>
      <p style={styles.message}>Il tuo account è stato confermato con successo. Ora puoi accedere alla tua area personale.</p>
      <button onClick={handleGoToDashboard} style={styles.button}>Vai alla Dashboard</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f4f7f6',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: '10px',
  },
  message: {
    fontSize: '18px',
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default EmailConfirmation;
