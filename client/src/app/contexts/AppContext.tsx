import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket, User } from '@acme/shared-models';

interface AppContextType {
  tickets: Ticket[];
  users: User[];
  changeAssigneeId: (ticketId: number, assigneeId: number | null) => void;
  completeTicket: (ticketId: number) => void;
  addTicket: (ticket: Ticket) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const ticketsResponse = await fetch('/api/tickets');
        const usersResponse = await fetch('/api/users');
        const ticketsData = await ticketsResponse.json();
        const usersData = await usersResponse.json();
        setTickets(ticketsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const changeAssigneeId = (ticketId: number, assigneeId: number | null) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return { ...ticket, assigneeId };
      }
      return ticket;
    });
    setTickets(updatedTickets);
  };

  const completeTicket = (ticketId: number) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return { ...ticket, completed: true };
      }
      return ticket;
    });
    setTickets(updatedTickets);
  }

  const addTicket = (ticket: Ticket) => {
    setTickets([...tickets, ticket]);
  }

  const value = { tickets, users, changeAssigneeId, completeTicket, addTicket };

  return <AppContext.Provider value={value} data-testid='mock-app-provider'>{children}</AppContext.Provider>;
};
