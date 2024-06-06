import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { TicketDetails } from './ticket-details';
import '@testing-library/jest-dom/extend-expect';

global.fetch = jest.fn();

const mockTicket = {
  id: 1,
  description: 'Install a monitor arm',
  assigneeId: 1,
  completed: false,
};

const mockUser = {
  id: 1,
  name: 'Alice',
};

describe('TicketDetails Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('renders loading state', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));

    render(
      <Router>
        <TicketDetails />
      </Router>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders error state', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch ticket'))
    );

    render(
      <Router>
        <TicketDetails />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch ticket/i)).toBeInTheDocument();
    });
  });

  test('renders ticket details', async () => {
    (fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockTicket),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockUser),
        })
      );

    render(
      <Router>
        <TicketDetails />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ticket Details/i)).toBeInTheDocument();
      expect(screen.getByText(`ID: ${mockTicket.id}`)).toBeInTheDocument();
      expect(
        screen.getByText(`Description: ${mockTicket.description}`)
      ).toBeInTheDocument();
      expect(screen.getByText(`Assignee: ${mockUser.name}`)).toBeInTheDocument();
      expect(screen.getByText(`Completed: No`)).toBeInTheDocument();
    });
  });
});
