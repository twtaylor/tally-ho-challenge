import React from 'react';
import ReactDOM from 'react-dom/client';

// Components
import Connect from './components/Connect';
import SignIn from './components/SignIn';
import SignMessage from './components/SignMessage';
import TokenBalances from './components/TokenBalances';

import reportWebVitals from './reportWebVitals';

import Web3Provider from './providers/Web3Provider';

// mui
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import theme from './theme';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

// TODO: use Context instead
const connectProvider = new Web3Provider();

root.render(
  <ThemeProvider theme={theme}>
    <Container maxWidth="xl" sx={{ mx: 'auto', mt: 100, m: 10 }}>
      <Stack spacing={2}>
        <Item>
          <Connect provider={connectProvider} />
        </Item>
        <Item>
          <SignIn provider={connectProvider} />
        </Item>
        <Item>
          <SignMessage provider={connectProvider} />
        </Item>
        <Item>
          <TokenBalances provider={connectProvider} />
        </Item>
      </Stack>
      <CssBaseline />
    </Container>  
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
