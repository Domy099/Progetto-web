"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import theme from "@/public/theme";
import { ThemeProvider } from "@mui/material/styles";
import "./reset2.css";
import { Typography } from "@mui/material";

const ResetPasswordConfirm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

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
      const response = await axios.post(`${STRAPI_API_URL}/api/auth/reset-password`,{
          password,
          passwordConfirmation: confirmPassword,
          code: token, // Il token ricevuto via email
      });

      alert("Password reimpostata con successo! Ora puoi effettuare il login.");
      router.push("/login"); // Reindirizza alla pagina di login
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Errore durante la reimpostazione della password."
      );
    }
  };

  const toggleMostraPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleMostraConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <div id="reset-password-container">
        <Typography variant="h2" id="reset-password-title" sx={{ mb: 3 }}>
          Reimposta Password
        </Typography>
        <form onSubmit={handleResetPassword}>
          <div id="password-container">
            <Typography variant="label" id="password-label">
              Nuova Password
            </Typography>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              placeholder="Password123"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "40px",
                marginBottom: "20px",
              }}
            >
              <span onClick={toggleMostraPassword} id="password-toggle">
                {showPassword ? 
                  (<Typography variant="label">Nascondi Password</Typography>) 
                  : 
                  (<Typography variant="label">Mostra Password</Typography>)
                }
              </span>
            </div>
          </div>
          <div id="confirm-password-container">
            <Typography variant="label" id="confirm-password-label">
              Conferma Password
            </Typography>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              placeholder="Password123"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "40px",
                marginBottom: "20px",
              }}
            >
              <span
                onClick={toggleMostraConfirmPassword}
                id="password-toggle"
              >
                {showConfirmPassword ? 
                  (<Typography variant="label">Nascondi Password</Typography>) 
                  : 
                  (<Typography variant="label">Mostra Password</Typography>)
                }
              </span>
            </div>
          </div>
          {error && <p id="error-message">{error}</p>}
          <button type="submit" id="reset-password-button">
            Reimposta Password
          </button>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default ResetPasswordConfirm;
