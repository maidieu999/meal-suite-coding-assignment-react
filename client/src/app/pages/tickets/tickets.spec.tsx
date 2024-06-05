import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Tickets } from './Tickets';
import { AppProvider } from '../../contexts/AppContext';

jest.mock('../../contexts/AppContext', () => ({
  __esModule: true,
  AppProvider: jest.fn().mockImplementation(({ children }) => <>{children}</>),
  useAppContext: jest.fn().mockReturnValue({
    tickets: [
      {
        id: 1,
        description: 'Install a monitor arm',
        assigneeId: 1,
        completed: false,
      },
      {
        id: 2,
        description: 'Move the desk to the new location',
        assigneeId: 1,
        completed: false,
      },
    ],
    users: [
      {
        id: 1,
        name: 'Alice',
      },
      {
        id: 2,
        name: 'Bob',
      },
    ],
  }),
}));

describe('Tickets Component', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <AppProvider>
          <Tickets />
        </AppProvider>
      </Router>
    );
    expect(screen.getByTestId('tickets-component')).toBeInTheDocument();
    expect(screen.getByTestId('ticket-list')).toBeInTheDocument();
  });

  test('displays ticket list', () => {
    render(
      <Router>
        <AppProvider>
          <Tickets />
        </AppProvider>
      </Router>
    );
    expect(screen.getByTestId('ticket-list')).toBeInTheDocument();
  });

  test('opens create ticket modal on button click', async () => {
    render(
      <Router>
        <AppProvider>
          <Tickets />
        </AppProvider>
      </Router>
    );
    fireEvent.click(screen.getByText('Add Ticket'));
    await waitFor(() => {
      expect(screen.getByTestId('create-ticket-modal')).toBeInTheDocument();
    });
  });
});
