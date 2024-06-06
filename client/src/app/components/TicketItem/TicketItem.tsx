import React from 'react';
import { Ticket } from '@acme/shared-models';
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AssignTicketModal } from '../AssignTicketModal/AssignTicketModal';
import { useAppContext } from '../../contexts/AppContext';
import { CompleteTicketModal } from '../CompleteTicketModal/CompleteTicketModal';
import { useTheme } from '@mui/material/styles';

interface TicketItemProps {
  ticket: Ticket;
  onSelectTicket: (id: number) => void;
}

export const TicketItem: React.FC<TicketItemProps> = ({
  ticket,
  onSelectTicket,
}) => {
  const theme = useTheme();
  const { changeAssigneeId, completeTicket } = useAppContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [showAssignTicketModal, setShowAssignTicketModal] =
    React.useState(false);
  const [showCompleteTicketModal, setShowCompleteTicketModal] =
    React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAssignTicket = (ticketId: number, userId: number) => {
    changeAssigneeId(ticketId, userId);
  };

  const handleCompleteTicket = (ticketId: number) => {
    completeTicket(ticketId);
  };

  return (
    <>
      <Stack
        key={ticket.id}
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
        onClick={() => onSelectTicket(ticket.id)}
        sx={{
          '&:hover': {
            transition: 'background-color 0.3s ease',
            backgroundColor: '#f0f0f0',
          },
          cursor: 'pointer',
        }}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar sx={{ backgroundColor: theme.palette.primary.main }}>
              {ticket.assigneeId ? ticket.assigneeId : <AccountCircle />}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={ticket.description}
            secondary={`ID: ${ticket.id}`}
          />
        </ListItem>
        <IconButton
          aria-label="more"
          id={`long-button-${ticket.id}`}
          aria-controls={open ? `long-menu-${ticket.id}` : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={(event) => {
            event.stopPropagation();
            handleClick(event);
          }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={`long-menu-${ticket.id}`}
          MenuListProps={{
            'aria-labelledby': `long-button-${ticket.id}`,
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          sx={{
            '& .MuiPaper-root': {
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <MenuItem
            id={`menu-item-assign-${ticket.id}`}
            onClick={(event) => {
              event.stopPropagation();
              setAnchorEl(null);
              setShowAssignTicketModal(true);
            }}
          >
            Assign
          </MenuItem>
          <MenuItem
            id={`menu-item-complete-${ticket.id}`}
            onClick={(event) => {
              event.stopPropagation();
              setAnchorEl(null);
              setShowCompleteTicketModal(true);
            }}
            disabled={!!ticket.completed}
          >
            Complete
          </MenuItem>
        </Menu>
      </Stack>
      <AssignTicketModal
        open={showAssignTicketModal}
        handleClose={() => setShowAssignTicketModal(false)}
        handleAssignTicket={handleAssignTicket}
        ticketId={ticket.id}
      />
      <CompleteTicketModal
        open={showCompleteTicketModal}
        handleClose={() => setShowCompleteTicketModal(false)}
        handleCompleteTicket={() => handleCompleteTicket(ticket.id)}
        ticketId={ticket.id}
      />
    </>
  );
};
