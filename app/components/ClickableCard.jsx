// ClickableCard.jsx
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
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <Typography variant="h6" className="text-black">{item}</Typography>
      </Paper>
    </Link>
  </Grid>
);

export default ClickableCard;