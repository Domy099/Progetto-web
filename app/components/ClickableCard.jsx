"use client";
import React from 'react';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const ClickableCard = ({ item }) => (
  <Grid item xs={12} sm={6} md={4} key={item}>
    <Link href={`/${item.toLowerCase()}`} passHref>
      <Paper
        elevation={3}
        className="p-4 text-center cursor-pointer card"
        sx={{
          transition: 'transform 0.2s',
          borderRadius: '16px', // Angoli arrotondati
          overflow: 'hidden',
          position: 'relative',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        {/* Aggiungi l'SVG direttamente nel componente */}
        <div
          style={{
            position: 'absolute',
            top: '-30px', // Posiziona l'SVG fuori dalla card
            right: '-10px',
            width: '60px',
            height: '60px',
            overflow: 'visible',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              width: '100px',
              height: '100px',
            }}
          >
            <circle cx="50" cy="50" r="50" fill="#EA580C" />
          </svg>
        </div>
        <Typography variant="h6" className="text-black">{item}</Typography>
      </Paper>
    </Link>
  </Grid>
);

export default ClickableCard;
