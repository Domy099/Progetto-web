"use client";
import React from 'react';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const ClickableCard = ({ item }) => (
  <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
    <Link href={`/${item.toLowerCase()}`} passHref>
      <Paper
        elevation={3}
        className="p-4 text-center cursor-pointer card"
        sx={{
          transition: 'transform 0.2s',
          borderRadius: '16px', // Angoli arrotondati
          overflow: 'hidden',
          position: 'relative', // Posizionamento relativo per ancorare gli elementi assoluti
          width: '100%',
          height: '200px', // Imposta un'altezza maggiore per ogni card
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '0px',
            right: '-20px',
            width: '80px',
            overflow: 'visible',
            rotate: '-15deg',
          }}
        >
          <img
            src="./mask.svg"
            alt="Mask"
            style={{
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              width: '100px',
              height: '100px',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '-130px',
            left: '-40px',
            width: '100px',
            height: '200px',
            overflow: 'visible',
            rotate: '30deg',
          }}
        >
          <img
          src="./pattern-rombi.png"
          alt="ROMBI"
          style={{}}
        />
        </div>

        

        <Typography variant="h6" className="text-black">{item}</Typography>
      </Paper>
    </Link>
  </Grid>
);




export default ClickableCard;
