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
        backgroundColor: "#d03526",
        textAlign: "center",
        padding: "24px 16px",
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Testo principale */}
      <Typography
        variant="body1"
        sx={{
          color: "#fff",
        }}
      >
        &copy; 2025 Carnevale di Putignano. Tutti i diritti riservati.
      </Typography>
    </Box>
  </ThemeProvider>
);

export default Footer;
