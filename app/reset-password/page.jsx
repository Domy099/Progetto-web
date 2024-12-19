"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    try {
      // Richiesta per inviare il token di reset via email
      const response = await axios.post("https://strapiweb.duckdns.org/api/auth/forgot-password", {
        email: email,
      });

      console.log("Email inviata con successo:", response.data);
      alert("Email inviata con successo! Controlla la tua casella di posta.");
      router.push("/login"); // Reindirizza alla pagina di login
    } catch (err) {
      setError(err.response?.data?.error?.message || "Errore durante l'invio della email.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ color: "black", fontWeight: "bold", textAlign: "left" }}>Reimposta Password</h2>
      <form onSubmit={handleResetPassword}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email" style={{ color: "#333", fontWeight: "bold", display: "block", textAlign: "center" }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="esempio@mail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              color: "#000",
            }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#EA580C",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Invia Email di Reset
        </button>
      </form>
    </div>
  );
};

export default ResetPassword; 
