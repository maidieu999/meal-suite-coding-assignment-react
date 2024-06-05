import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface CompleteTicketModalProps {
  open: boolean;
  handleClose: () => void;
  handleCompleteTicket: () => void;
  ticketId: number;
}

export const CompleteTicketModal: React.FC<CompleteTicketModalProps> = ({
  open,
  handleClose,
  handleCompleteTicket,
  ticketId,
}) => {
  const onCompleteTicket = async () => {
    try {
      await fetch(`/api/tickets/${ticketId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleCompleteTicket();
      handleClose();
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
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
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Complete Ticket
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Are you sure you want to complete this ticket?
        </Typography>
        <Button onClick={onCompleteTicket} variant="contained" sx={{ mt: 2 }}>
          Complete
        </Button>
        <Button onClick={handleClose} variant="outlined" sx={{ mt: 2, ml: 2 }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};
