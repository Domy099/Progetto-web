"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Login = () => {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostraPassword, setMostraPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset any previous errors

    try {
      const response = await axios.post(`${STRAPI_API_URL}/api/auth/local`, {
        identifier: email,
        password: password,
      });

      console.log('User profile:', response.data.user);
      console.log('User token:', response.data.jwt);

      sessionStorage.setItem('token', response.data.jwt);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Errore. Credenziali non valide.');
    }
  };

  const handleRegistrazione = () => {
    router.push('/registrazione'); // Reindirizza alla pagina di registrazione
  };

  const toggleMostraPassword = () => {
    setMostraPassword(!mostraPassword);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ color: 'black', fontWeight: 'bold', textAlign: 'left' }}>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ color: '#333', fontWeight: 'bold', display: 'block', textAlign: 'center' }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="esempio@mail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              color: '#000',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ color: '#333', fontWeight: 'bold', display: 'block', textAlign: 'center' }}>Password</label>
          <input
            type={mostraPassword ? 'text' : 'password'}
            id="password"
            value={password}
            placeholder="Password123"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              color: '#000',
            }}
          />
          <button
            type="button"
            onClick={toggleMostraPassword}
            style={{ marginTop: '5px', cursor: 'pointer', background: 'none', border: 'none', color: '#007BFF' }}
          >
            {mostraPassword ? 'Nascondi Password' : 'Mostra Password'}
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#EA580C',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleRegistrazione} // Chiamata alla funzione di reindirizzamento
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '10px',
            backgroundColor: '#EA580C',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Registrati
        </button>
      </form>
    </div>
  );
};

export default Login;
