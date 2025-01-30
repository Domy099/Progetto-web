"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../public/theme';

export default function EventCard(props) {
  const { title, description, image, altText, tipo, data, orario, posizione } = props;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Card sx={{ minWidth: 270, maxWidth: 345, position: 'relative', borderRadius: '20px' }}>
        <CardActionArea>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <CardMedia
              component="img"
              height="140"
              image={image}
              alt={altText}
              sx={{
                borderRadius: '10px',
                width: '100%',
                height: 200,
                objectFit: 'cover',
              }}
            />

            <Chip
              label={tipo}
              sx={{
                alignSelf: 'flex-start',
                ...getColoriChip(tipo),
                marginBottom: 2,
                marginTop: 2,
                typography: 'label',
                color: 'white',
              }}
            />

            <Typography variant="h2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title}
            </Typography>

            <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
              <Typography fontSize={20}>📅</Typography>
              <Typography variant="body1" sx={{ color: 'text.primary', marginTop: 1 }}>
                {data ? new Date(data).toLocaleDateString() : 'Non disponibile'}
              </Typography>
            </span>

            <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
              <Typography fontSize={20}>🕒</Typography>
              <Typography variant="body1" sx={{ color: 'text.primary', marginTop: 1 }}>
                {orario ? new Date('1970-01-01T' + orario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Non disponibile'}
              </Typography>
            </span>

            <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
              <Typography fontSize={20}>📍</Typography>
              <Typography variant="body1" sx={{ marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }}>
                {posizione || 'Non disponibile'}
              </Typography>
            </span>
          </CardContent>
        </CardActionArea>
      </Card>
    </ThemeProvider>
  );
}

const getColoriChip = (tipo) => {
  switch (tipo?.trim().toLowerCase()) {
    case 'concerto':
      return { backgroundColor: '#4caf50', }; // Verde
    case 'sfilata':
      return { backgroundColor: '#2196f3', }; // Blu
    case 'convivialità':
      return { backgroundColor: '#ff9800', }; // Arancione
    case 'presentazione':
      return { backgroundColor: 'orange', }; // Arancione
    default:
      return { backgroundColor: 'gray', }; // Default
  }
};