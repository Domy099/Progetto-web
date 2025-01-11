import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar

const FeedbackCard = ({ nomeEvento, descrizioneFeedback, documentId, onFeedbackDeleted }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const token = sessionStorage.getItem("token");

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    cancellaFeedback(); 
    setOpenDialog(false);
    setOpenSnackbar(true); // Show snackbar after confirmation
  };

  // Funzione di cancellazione
  const cancellaFeedback = async () => {
    
    try {
      const response = await fetch(`${STRAPI_API_URL}/api/feedbacks/${documentId}`, 
        {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        console.log('Feedback cancellato con successo');
        onFeedbackDeleted(); //Callback per aggiornare la lista
      } else {
        console.error('Errore durante la cancellazione:', response.statusText);
      }
    } catch (error) {
      console.error('Errore nella richiesta:', error);
    }
  };
 

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: 200,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
        transition: "0.3s",
        "&:hover": { transform: "scale(1.03)" },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Evento: {nomeEvento}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#424242",
            marginTop: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
          }}
        >
          Cosa ne pensi: {descrizioneFeedback}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="error"
          onClick={handleClickOpen}
        >
          Cancella Feedback
        </Button>
      </CardActions>

      {/* Overlay di conferma */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
      >
        <DialogTitle>Conferma Cancellazione</DialogTitle>
        <DialogContent>
          <Typography>
            Sei proprio sicuro di non volerci aiutare?
          </Typography>
          <Typography sx={{ color: "red" }}>
            Questa azione non può essere annullata.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annulla
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Conferma
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar di conferma */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Duration in milliseconds (3 seconds)
        onClose={handleCloseSnackbar}
        message="Feedback cancellato con successo!"
      />
    </Card>
  );
};

export default FeedbackCard;
