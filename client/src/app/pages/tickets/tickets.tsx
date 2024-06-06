import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { Button, Stack, Typography } from '@mui/material';
import { TicketItem } from '../../components/TicketItem';
import { useNavigate } from 'react-router-dom';
import { CreateTicketModal } from '../../components/CreateTicketModal';
import { useAppContext } from '../../contexts/AppContext';
import { Ticket } from '@acme/shared-models';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export function Tickets() {
  const { tickets: ticketList, addTicket } = useAppContext();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(ticketList);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);

  const filterTickets = () => {
    switch (value) {
      case 0: // All
        return ticketList;
      case 1: // In Progress
        return ticketList.filter((t) => t.assigneeId !== null && !t.completed);
      case 2: // Completed
        return ticketList.filter((t) => t.completed);
      case 3: // Unassign
        return ticketList.filter((t) => t.assigneeId === null && !t.completed);
      default:
        return ticketList;
    }
  };

  useEffect(() => {
    const filtered = filterTickets();
    setFilteredTickets(filtered);
  }, [value, ticketList]);

  const handleSelectTicket = (id: number) => {
    navigate(`/tickets/${id}`);
  };

  const handleCreateTicket = (ticket: Ticket) => {
    addTicket(ticket);
    setShowCreateTicketModal(false);
  };

  return (
    <Stack justifyContent="center" alignItems="center" data-testid='tickets-component'>
      <Box
        sx={{
          bgcolor: 'background.paper',
          width: 1000,
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            position: 'relative',
          }}
        >
          <Tabs
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            aria-label="basic tabs example"
          >
            <Tab label="All" {...a11yProps(0)} />
            <Tab label="In Progress" {...a11yProps(1)} />
            <Tab label="Completed" {...a11yProps(2)} />
            <Tab label="Unassign" {...a11yProps(3)} />
          </Tabs>
          <Button
            onClick={() => setShowCreateTicketModal(true)}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
            }}
          >
            Add Ticket
          </Button>
        </Box>
        {filteredTickets.length > 0 ? (
          <List sx={{ width: '100%' }} data-testid='ticket-list'>
            {filteredTickets.map((t) => (
              <TicketItem
                key={t.id}
                ticket={t}
                onSelectTicket={handleSelectTicket}
              />
            ))}
          </List>
        ) : (
          <Typography mt={2}>There are no tickets</Typography>
        )}
      </Box>
      <CreateTicketModal
        open={showCreateTicketModal}
        handleClose={() => setShowCreateTicketModal(false)}
        handleCreateTicket={handleCreateTicket}
      />
    </Stack>
  );
}
