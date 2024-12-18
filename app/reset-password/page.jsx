"use client";
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Container } from '@mui/material';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = () => {
    if (password !== confirmPassword) {
      setErrorMessage('Le password non coincidono.');
      setSuccessMessage('');
      return;
    }

    // Simula l'invio della richiesta di reset della password
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('Password reimpostata con successo!');
    }, 1000);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Reimposta la tua password
        </Typography>

        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <TextField
          label="Nuova Password"
          type="password"
          fullWidth
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          label="Conferma Password"
          type="password"
          fullWidth
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleResetPassword}
        >
          Reimposta Password
        </Button>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
