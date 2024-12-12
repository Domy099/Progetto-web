"use client";
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => (
  <Box
    component="footer"
    className="bg-orange-600 text-white p-4 mt-4 text-center"
    sx={{ margin: 0, padding: 0 }}
  >
    <Typography variant="body1">&copy; 2024 Carnevale di Putignano. Tutti i diritti riservati.</Typography>
  </Box>
);

export default Footer;