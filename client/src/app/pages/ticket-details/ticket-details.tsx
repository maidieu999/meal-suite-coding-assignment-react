import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Stack, styled } from '@mui/material';
import { Ticket, User } from '@acme/shared-models';

const Loading = () => (
  <CenteredStack>
    <CircularProgress />
  </CenteredStack>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <CenteredStack>
    <Typography color="error">{message}</Typography>
  </CenteredStack>
);

const CenteredStack = styled(Stack)({
  justifyContent: 'center',
  alignItems: 'center',
});

export const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketRes = await fetch(`/api/tickets/${id}`);
        if (!ticketRes) {
          throw new Error('Failed to fetch ticket');
        }
        const ticket = await ticketRes.json();
        setTicket(ticket);

        const userRes = await fetch(`/api/users/${ticket.assigneeId}`);
        if (!userRes) {
          throw new Error('Failed to fetch assignee');
        }
        const user = await userRes.json();
        setUser(user);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <CenteredStack>
      <Box
        sx={{
          bgcolor: 'background.paper',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          width: '80%',
          maxWidth: 600,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ticket Details
        </Typography>
        <Typography>ID: {ticket?.id}</Typography>
        <Typography>Description: {ticket?.description}</Typography>
        <Typography>Assignee: {user?.name || 'N/A'}</Typography>
        <Typography>Completed: {ticket?.completed ? 'Yes' : 'No'}</Typography>
      </Box>
    </CenteredStack>
  );
};
