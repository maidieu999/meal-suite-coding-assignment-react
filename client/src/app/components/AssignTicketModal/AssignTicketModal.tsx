import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import { useAppContext } from '../../contexts/AppContext';

interface AssignTicketModalProps {
  open: boolean;
  handleClose: () => void;
  handleAssignTicket: (ticketId: number, userId: number) => void;
  ticketId: number;
}

export const AssignTicketModal: React.FC<AssignTicketModalProps> = ({ open, handleClose, handleAssignTicket, ticketId }) => {
  const { users } = useAppContext();
  const [selectedUser, setSelectedUser] = useState<number | ''>('');
  const onAssignTicket = async () => {
    try {
        await fetch(`/api/tickets/${ticketId}/assign/${selectedUser}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        handleAssignTicket(ticketId, selectedUser as number);
        handleClose();
      } catch (error) {
        console.error('Error assigning ticket:', error);
      }
  };

  const handleChangeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedUser(Number(event.target.value));
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
          Assign Ticket
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Please select a user to assign the ticket to.
        </Typography>
        <TextField
          select
          autoFocus
          margin="dense"
          id="user"
          label="Select User"
          fullWidth
          variant="standard"
          value={selectedUser}
          onChange={handleChangeUser}
          sx={{ mt: 2 }}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </TextField>
        <Button onClick={onAssignTicket} variant="contained" sx={{ mt: 2 }}>
          Assign
        </Button>
        <Button onClick={handleClose} variant="outlined" sx={{ mt: 2, ml: 2 }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};
