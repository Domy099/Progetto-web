"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import theme from "@/public/theme";
import { ThemeProvider } from "@mui/material/styles";
import "./reset.css";
import { Typography } from "@mui/material";
import Box from "@mui/material";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    try {
      const response = await axios.post(`${STRAPI_API_URL}/api/auth/forgot-password`,{
          email: email,
      });

      alert("Email inviata con successo! Controlla la tua casella di posta.");
      router.push("/login"); // Reindirizza alla pagina di login

    } catch (err) {
      setError(
        err.response?.data?.error?.message || "Errore durante l'invio della email."
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div id="reset-password-box">
        <Typography variant="h2" sx={{ mb: 3 }}>Reset Password</Typography>
        <form onSubmit={handleResetPassword}>
          <div>
            <Typography variant="label" id="email-label">
              Email
            </Typography>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="esempio@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p id="error-msg">{error}</p>}
          <button type="submit" id="reset-password" style={{ marginTop: "20px" }}>
            Invia Email di Reset
          </button>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default ResetPassword;
