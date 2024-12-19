"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ResetPasswordConfirm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("code");

    if (!token) {
      setError("Token mancante. Controlla il link ricevuto via email.");
      return;
    }

    // Se c'è il token, procedi con il reimpostare la password
  }, []);

  const toggleMostraPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleMostraConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("code");

    if (!token) {
      setError("Token mancante. Controlla il link ricevuto via email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }

    try {
      const response = await axios.post("https://strapiweb.duckdns.org/api/auth/reset-password", {
        password,
        passwordConfirmation: confirmPassword,
        code: token, // Il token ricevuto via email
      });

      console.log("Password reimpostata con successo:", response.data);
      alert("Password reimpostata con successo! Ora puoi effettuare il login.");
      router.push("/login"); // Reindirizza alla pagina di login
    } catch (err) {
      setError(err.response?.data?.error?.message || "Errore durante la reimpostazione della password.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ color: "black", fontWeight: "bold", textAlign: "left" }}>Imposta Nuova Password</h2>
      <form onSubmit={handleResetPassword}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password" style={{ color: "#333", fontWeight: "bold", display: "block", textAlign: "center" }}>Nuova Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            placeholder="Password123"
            onChange={(e) => setPassword(e.target.value)}
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
          <button
            type="button"
            onClick={toggleMostraPassword}
            style={{ marginTop: "5px", cursor: "pointer", background: "none", border: "none", color: "#007BFF" }}
          >
            {showPassword ? "Nascondi Password" : "Mostra Password"}
          </button>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="confirmPassword" style={{ color: "#333", fontWeight: "bold", display: "block", textAlign: "center" }}>Conferma Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            placeholder="Password123"
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          <button
            type="button"
            onClick={toggleMostraConfirmPassword}
            style={{ marginTop: "5px", cursor: "pointer", background: "none", border: "none", color: "#007BFF" }}
          >
            {showConfirmPassword ? "Nascondi Password" : "Mostra Password"}
          </button>
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
          Reimposta Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordConfirm; 
