import React, { useState, ChangeEvent } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { Ticket } from '@acme/shared-models';

interface CreateTicketModalProps {
  open: boolean;
  handleClose: () => void;
  handleCreateTicket: (ticket: Ticket) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ open, handleClose, handleCreateTicket }) => {
  const [description, setDescription] = useState('');

  const onClose = () => {
    setDescription('');
    handleClose();
  }

  const onCreateTicket = async () => {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description
      })
    });
    const newTicket: Ticket = await response.json();
    handleCreateTicket(newTicket);
    onClose();
  };

  const handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      data-testid='create-ticket-modal'
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create New Ticket
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Please enter the description for the new ticket.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={description}
          onChange={handleChangeDescription}
          sx={{ mt: 2 }}
        />
        <Button onClick={onCreateTicket} variant="contained" sx={{ mt: 2 }}>
          Create
        </Button>
        <Button onClick={onClose} variant="outlined" sx={{ mt: 2, ml: 2 }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};
