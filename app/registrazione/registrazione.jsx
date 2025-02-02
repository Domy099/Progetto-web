import React, { useState } from "react";
import axios from "axios";
import "./registrazione.css"; // Puoi personalizzare lo stile qui
import { useRouter } from "next/router";
import { Snackbar, Alert, Typography } from "@mui/material";
import theme from "@/public/theme";
import { ThemeProvider } from "@mui/material/styles";
import Router from "next/router";
import { Box } from "@mui/system";

const Registrazione = () => {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${STRAPI_API_URL}/api/auth/local/register`,{
          username: username,
          email: email,
          password: password,
      });
      // Mostra la snackbar
      setOpenSnackbar(true);
      // Reindirizza alla home page
      router.push("/");
    } catch (error) {
      console.log("Errore : ", error.response);
      setError("Registrazione fallita. Riprova.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div id="registrazione-container">
        <Typography variant="h2" sx={{ mb: 3 }}>Registrazione</Typography>
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
          <div id="email-container" style={{ marginBottom: "20px" }}>
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
          <div id="username-container" style={{ marginBottom: "20px" }}>
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
          <div id="password-container" style={{ marginBottom: "20px" }}>
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
            <Box
              sx={{ display: "flex", justifyContent: "center", height: "40px" }}
            >
              <span
                id="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  (<Typography variant="label">Nascondi Password</Typography>) 
                  :
                  (<Typography variant="label">Mostra Password</Typography>)
                }
              </span>
            </Box>
          </div>
          {error && <p id="error-message">{error}</p>}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <button type="submit" id="registrazione-button">
              Registrati
            </button>
          </Box>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default Registrazione;
