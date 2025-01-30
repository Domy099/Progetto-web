import React, { useState } from "react";
import axios from "axios";
import "./registrazione.css"; // Puoi personalizzare lo stile qui
import { useRouter } from "next/router";
import { Snackbar, Alert, Typography } from "@mui/material";
import theme from "@/public/theme";
import { ThemeProvider } from "@mui/material/styles";

const Registrazione = () => {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${STRAPI_API_URL}/api/auth/local/register`,
        {
          username: username,
          email: email,
          password: password,
        }
      );
      console.log("User profile", response.data.user);
      console.log("User token", response.data.jwt);

      // Mostra la snackbar
      setOpenSnackbar(true);

      // Reindirizza alla home page
      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
    } catch (error) {
      console.log("An error occurred:", error.response);
      setError("Registrazione fallita. Riprova.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div id="registrazione-container">
        <Typography variant="h2">Registrazione</Typography>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={20000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="info">
            Controlla la tua email per confermare la registrazione!
          </Alert>
        </Snackbar>
        <form id="registrazione-form" onSubmit={handleSubmit}>
          <div id="email-container">
            <Typography variant="label" id="email-label">
              Email
            </Typography>
            <input
              type="email"
              id="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="esempio@mail.com"
              required
            />
          </div>
          <div id="username-container">
            <Typography variant="label" id="username-label">
              Username
            </Typography>
            <input
              type="text"
              id="username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nickname123"
              required
            />
          </div>
          <div id="password-container">
            <Typography variant="label" id="password-label">
              Password
            </Typography>
            <input
              type={showPassword ? "text" : "password"}
              id="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password123"
              required
            />
            <div id="password-toggle-container">
              <span
                id="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Nascondi Password" : "Mostra Password"}
              </span>
            </div>
          </div>
          {error && <p id="error-message">{error}</p>}
          <button type="submit" id="registrazione-button">
            Registrati
          </button>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default Registrazione;
