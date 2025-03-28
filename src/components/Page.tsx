"use client"
import React, { ReactNode } from 'react';
import AOS from 'aos';
import Paper from '@mui/material/Paper';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();



type PageProps = {
  children: ReactNode; // Allows JSX, strings, numbers, etc.
};

const Page: React.FC<PageProps> = ({ children }) => {
    React.useEffect(() => {
        // Remove the server-side injected CSS
        AOS.init({
          once: true,
          delay: 0,
          duration: 800,
          offset: 0,
          easing: 'ease-in-out',
        });
      }, []);
  return (
    <>
        <ThemeProvider theme={theme}>

          <CssBaseline />

  <Paper>{children}</Paper>
  </ThemeProvider>
    </>
)
};

export default Page;
