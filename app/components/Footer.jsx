"use client";
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => (
  <Box
    component="footer"
    className="text-white p-4 mt-4 text-center"
    sx={{ backgroundColor: '#408eb5', margin: 0, padding: 0 }}
  >
    <Typography variant="body1">&copy; 2024 Carnevale di Putignano. Tutti i diritti riservati.</Typography>
  </Box>
);

export default Footer;
