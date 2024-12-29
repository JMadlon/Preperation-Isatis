import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import {
  Container
} from '@mui/system';

export default function App() {
  return (
    <Box
      sx={{  display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stagevoorbereiding Isatis
          </Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Projects</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact</Button>
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Container
        component="main"
        maxWidth={false}
        sx={{ width: '100vw', flexGrow: 1, bgcolor: '#f0f0f0', textAlign: 'center'}}>
        <Typography variant="h1" sx={{ pt: 20 }}>
          Welcome to Stagevoorbereiding Isatis!
        </Typography>
      </Container>
    </Box>
  );
}
