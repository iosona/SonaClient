import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import React, { useMemo } from 'react';

import { GlobalStyles } from '@mui/material';

const globalScrollbar = (
  <GlobalStyles
    styles={{
      '*': {
        scrollbarWidth: 'thin',
        scrollbarColor: '#ccc transparent',
      },
      '*::-webkit-scrollbar': {
        width: '8px',   
        height: '8px',  
      },
      '*::-webkit-scrollbar-track': {
        background: 'transparent', 
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: '#bdbdbd', 
        borderRadius: '10px',     
        border: '2px solid transparent', 
        backgroundClip: 'content-box',   
      },
      '*::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#9e9e9e', 
      },
    }}
  />
);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mode = 'dark';

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
  }), []);

  return (
    <ThemeProvider theme={theme}>
      { globalScrollbar }
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
