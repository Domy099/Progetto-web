'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardNuova() {
  const router = useRouter();

  // Stato per i dati dell'utente, i biglietti, stato di caricamento ed errori
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]); // Stato per i biglietti
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Recupera il token dal sessionStorage
    const token = sessionStorage.getItem('token');

    if (!token) {
      // Reindirizza alla pagina di login se non c'è il token
      router.push('/login');
      return;
    }

    // Funzione per recuperare i dati dell'utente e i biglietti
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://strapiweb.duckdns.org/api/users/me?populate=*', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Impossibile recuperare i dati utente');
        }

        const userData = await response.json();
        console.log(userData);  // Aggiungi questo per vedere la risposta

        // Imposta i dati dell'utente
        setUser(userData);

        // Controlla se la risposta contiene i biglietti
        const userTickets = userData.biglietti;
        
        console.log(userTickets);
        setTickets(userTickets);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (error) {
    return <p>Errore: {error}</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Benvenuto nella tua Dashboard</h1>
      <div>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div>
        <h2>I miei biglietti</h2>
        {tickets.length > 0 ? (
          <ul>
            {tickets.map(ticket => (
              <li key={ticket.id}>
                Codice: {ticket.codice}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nessun biglietto</p>
        )}
      </div>

      <button
        onClick={() => {
          sessionStorage.removeItem('token');
          router.push('/login');
        }}
      >
        Logout
      </button>
    </div>
  );
}
