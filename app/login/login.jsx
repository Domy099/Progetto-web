"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./login.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/public/theme";
import { Box, Typography } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostraPassword, setMostraPassword] = useState(false);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const router = useRouter();
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [disattivato, setDisattivato] = useState(false);
  const mailAssistenza = process.env.NEXT_PUBLIC_MAIL_ASSISTENZA;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${STRAPI_API_URL}/api/auth/local`, {
        identifier: email,
        password: password,
      });

      if (response.data.user.disattivato) {
        alert(
          "Utente disattivato. Se credi ci sia un errore, contatta l'amministratore: " +
            `${mailAssistenza}`
        );
        return;
      }

      sessionStorage.setItem("token", response.data.jwt);
      router.push("/dashboard");
    } catch (err) {
      setFailedAttempts(failedAttempts + 1);
      setError(
        err.response?.data?.message || "Errore. Credenziali non valide."
      );
    }
  };

  const handleRegistrazione = () => {
    router.push("/registrazione");
  };

  const handlePassReset = () => {
    router.push("/reset-password");
  };

  const toggleMostraPassword = () => {
    setMostraPassword(!mostraPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <div id="login-container">
        <Typography variant="h2" id="login-title">
          Login
        </Typography>
        <form id="login-form" onSubmit={handleLogin}>
          <div id="email-container" style={{ marginTop: "20px" }}>
            <Typography variant="label">Email</Typography>
            <input
              type="email"
              id="email-input"
              value={email}
              placeholder="esempio@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ fontFamily: "kaio-regular" }}
            />
          </div>
          <div id="password-container" style={{ marginTop: "20px" }}>
            <Typography variant="label">Password</Typography>
            <input
              type={mostraPassword ? "text" : "password"}
              id="password-input"
              value={password}
              placeholder="Password123"
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ fontFamily: "kaio-regular" }}
            />
            <Box
              sx={{ display: "flex", justifyContent: "center", height: "40px" }}
            >
              <button
                type="button"
                id="toggle-password-btn"
                onClick={toggleMostraPassword}
              >
                {mostraPassword ? 
                  (<Typography variant="label">Nascondi Password</Typography>) 
                  :
                  (<Typography variant="label">Mostra Password</Typography>)
                }
              </button>
            </Box>
          </div>
          {error && <p id="error-message">{error}</p>}
          {failedAttempts > 0 && (
            <button
              type="button"
              id="reset-password-btn"
              onClick={handlePassReset}
            >
              <Typography
                variant="body1Bold"
                fontSize={14}
                justifySelf={"center"}
              >
                Hai dimenticato la password? Reimposta qui.
              </Typography>
            </button>
          )}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <button type="button" id="login-btn" onClick={handleRegistrazione}>
              Registrati
            </button>
            <button type="submit" id="login-btn">
              Login
            </button>
          </Box>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default Login;
