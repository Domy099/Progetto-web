import { createTheme} from '@mui/material/styles';

const theme = createTheme({
  typography: {
    h1: {
      fontFamily: 'kaio-super, Arial, Helvetica, sans-serif', // Font per h1
      fontSize: '2.5rem', // Dimensione personalizzata
      color: '#333', 
    },
    h2: {
      fontFamily: 'kaio-medium, Arial, Helvetica, sans-serif', // Font per h2
      fontSize: '1.40rem', // Dimensione personalizzata
      color: '#333', 
    },
    body1: {
      fontFamily: 'kaio-regular, Arial, Helvetica, sans-serif', // Font per body1
      fontSize: '1rem', // Dimensione personalizzata
      color: '#333', 
    },
  },
});

export default theme;