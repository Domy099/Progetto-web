import { useRouter } from 'next/navigation'; 
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BottoneIndietro = ({ destinazione }) => {
    const router = useRouter();
  
    return (
      <Box gap={2} mt={2} onClick={() => router.push(destinazione)} edge="start">
        <span style={{display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <IconButton >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body2" color= "text.secondary">
          Torna indietro
        </Typography>
        </span>
      </Box>
    );
  };
  
  export default BottoneIndietro;