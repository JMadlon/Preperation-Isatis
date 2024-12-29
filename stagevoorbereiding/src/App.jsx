import React from 'react';
import { Route, Switch, Link, useLocation } from 'wouter';
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

import Home from './pages/Home';
import Projects from './pages/Projects';
import Employees from './pages/Employees';
import Planning from './pages/Planning';
import NotFound from './pages/NotFound';


function getPageTitle(path) {
  switch (path) {
    case '/':
      return 'Home';
    case '/projects':
      return 'Projects';
    case '/employees':
      return 'Employees';
    case '/planning':
      return 'Planning';
    default:
      return 'Stagevoorbereiding Isatis';
  }
}

export default function App() {
  const [location] = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {getPageTitle(location)}
          </Typography>

          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="inherit">Home</Button>
          </Link>
          <Link href="/projects" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="inherit">Projects</Button>
          </Link>
          <Link href="/employees" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="inherit">Employees</Button>
          </Link>
          <Link href="/planning" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="inherit">Planning</Button>
          </Link>
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Container
        component="main"
        maxWidth={false}
        sx={{ width: '100vw', flexGrow: 1, bgcolor: '#f0f0f0', textAlign: 'center'}}
      >
        <Switch>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/projects">
            <Projects />
          </Route>
          <Route path="/employees">
            <Employees />
          </Route>
          <Route path="/planning">
            <Planning />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Container>
    </Box>
  );
}
