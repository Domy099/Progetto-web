import React, { useState } from "react";
import { Card, CardContent, Typography, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Divider, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const FeedbackCard = ({ nomeEvento, descrizioneFeedback, documentId, onFeedbackDeleted, onFeedbackUpdated, token, }) => {
  const [openDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [newFeedback, setNewFeedback] = useState(descrizioneFeedback);
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  const handleDeleteClickOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteClickClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleEditClickOpen = () => setOpenEditDialog(true);
  const handleEditClose = () => setOpenEditDialog(false);

  const handleConfirmDelete = () => {
    cancellaFeedback();
    setOpenDialog(false);
    setOpenSnackbar(true);
  };

  const cancellaFeedback = async () => {
    try {
      const response = await fetch(
        `${STRAPI_API_URL}/api/feedbacks/${documentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Feedback cancellato con successo");
        onFeedbackDeleted();
      } else {
        console.error("Errore durante la cancellazione:", response.statusText);
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  };

  const handleConfirmUpdate = () => {
    modificaFeedback();
    setOpenDialog(false);
    setOpenSnackbar(true);
  };

  const modificaFeedback = async () => {
    try {
      const response = await fetch(
        `${STRAPI_API_URL}/api/feedbacks/${documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              descrizione: newFeedback,
            },
          }),
        }
      );

      if (response.ok) {
        console.log("Feedback modificato con successo");
        if (onFeedbackUpdated) onFeedbackUpdated();
        setOpenSnackbar(true);
      } else {
        console.error("Errore durante modifica:", response.statusText);
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    } finally {
      setOpenEditDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        borderRadius: 5,
        backgroundColor: "white",
        transition: "0.3s",
        "&:hover": { transform: "scale(1.03)" },
      }}
    >
      <CardContent>
        <Typography
          variant="body1Bold"
          sx={{
            fontSize: 17,
          }}
        >
          Evento:
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#408eb5",
            marginLeft: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: 17,
          }}
        >
          {nomeEvento}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#424242",
            marginTop: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            minHeight: "3em",
          }}
        >
          <strong>Cosa ne pensi:</strong> {descrizioneFeedback}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end", gap: 1, marginRight: 1 }}>
        <IconButton size="small" color="primary" onClick={handleEditClickOpen}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" color="error" onClick={handleDeleteClickOpen}>
          <DeleteIcon />
        </IconButton>
      </CardActions>

      {/* Overlay di conferma cancellazione */}
      <Dialog open={openDialog} onClose={handleDeleteClickClose}>
        <DialogTitle>Conferma Cancellazione</DialogTitle>
        <DialogContent>
          <Typography>Sei proprio sicuro di non volerci aiutare?</Typography>
          <Typography sx={{ color: "red" }}>
            Questa azione non può essere annullata.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClickClose} color="primary">
            Annulla
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Conferma
          </Button>
        </DialogActions>
      </Dialog>

      {/* Overlay per modifica feedback */}
      <Dialog open={openEditDialog} onClose={handleEditClose}>
        <DialogTitle>Modifica Feedback</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nuovo Feedback"
            variant="outlined"
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Annulla
          </Button>
          <Button onClick={modificaFeedback} color="success">
            Conferma
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar di conferma */}
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Azione completata con successo!"
        sx={{ textAlign: "center" }}
      />
    </Card>
  );
};

export default FeedbackCard;
