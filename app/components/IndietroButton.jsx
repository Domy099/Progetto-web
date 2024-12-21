import { useRouter } from 'next/navigation'; 
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BottoneIndietro = ({ destinazione }) => {
    const router = useRouter(); // Inizializzazione di useRouter
  
    return (
      <Box display="flex" alignItems="center" gap={2} mt={2} onClick={() => router.push(destinazione)} edge="start">
        <IconButton >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          Torna indietro
        </Typography>
      </Box>
    );
  };
  
  export default BottoneIndietro;