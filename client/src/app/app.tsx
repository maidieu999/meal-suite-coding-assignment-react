import { Routes, Route } from 'react-router-dom';

import styles from './app.module.css';
import { Tickets } from './pages/tickets';
import { TicketDetails } from './pages/ticket-details';
import { Typography } from '@mui/material';

const App = () => {
  return (
    <div className={styles['app']}>
      <Typography variant='h3' fontWeight='500' textAlign='center' mb={5}>Tickets App</Typography>
      <Routes>
        <Route path="tickets/" element={<Tickets />} />
        <Route path="tickets/:id" element={<TicketDetails />} />
      </Routes>
    </div>
  );
};

export default App;
