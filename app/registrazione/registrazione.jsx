import React, { useState } from 'react';
import axios from 'axios';
import './registrazione.css'; // Puoi personalizzare lo stile qui
import { useRouter } from 'next/router';

const Registrazione = () => {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${STRAPI_API_URL}/api/auth/local/register`, {
        username: username,
        email: email,
        password: password,
      });
      console.log("User profile", response.data.user);
      console.log("User token", response.data.jwt);

      // Mostra l'alert di successo
      alert("Registrazione avvenuta con successo!");
      
      // Reindirizza alla home page usando un link
      window.location.href = '/'; // o usa useRouter() per il reindirizzamento, ma href è più semplice
    } catch (error) {
      console.log("An error occurred:", error.response);
      setError("Registrazione fallita. Riprova.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px', textAlign: 'center' }}>
      <h2 style={{ color: 'black', fontWeight: 'bold', textAlign: 'left' }}>Registrazione</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ color: 'black', fontWeight: 'bold' }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Inserisci la tua email"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ color: 'black', fontWeight: 'bold' }}>Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Inserisci il tuo username"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ color: 'black', fontWeight: 'bold' }}>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Inserisci la tua password"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
          />
          <div style={{ marginTop: '5px', textAlign: 'left' }}>
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ color: '#007BFF', cursor: 'pointer', textDecoration: 'none' }}
            >
              {showPassword ? 'Nascondi Password' : 'Mostra Password'}
            </span>
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          className="bg-600"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#EA580C',
            color: 'white',
            fontWeight: 'bold',
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

export default Registrazione;
