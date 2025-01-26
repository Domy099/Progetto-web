"use client";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/public/theme";

const Footer = () => (
  <ThemeProvider theme={theme}>
    <Box
      component="footer"
      sx={{
        backgroundColor: "#d03526", // Colore rosa vivace dal tema
        textAlign: "center",
        padding: "24px 16px", // Spaziatura coerente
        marginTop: "32px",
        borderRadius: "8px 8px 0 0", // Bordo arrotondato in alto
        boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)", // Leggera ombra
      }}
    >
      {/* Testo principale */}
      <Typography
        variant="body1"
        sx={{
          color: "#fff", // Testo bianco per contrasto
        }}
      >
        &copy; 2025 Carnevale di Putignano. Tutti i diritti riservati.
      </Typography>

      {/* Testo secondario
      <Typography
        variant="body2"
        sx={{
          marginTop: "8px",
          fontStyle: "italic", // Corsivo per aggiungere un tocco elegante
          color: "#fff", // Testo bianco per contrasto
        }}
      >
        Un tributo alla tradizione e alla gioia della Puglia.
      </Typography>
      */}
    </Box>
  </ThemeProvider>
);

export default Footer;
