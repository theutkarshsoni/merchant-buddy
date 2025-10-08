'use client';
import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

export default function Providers({ children }: PropsWithChildren) {
  const [qc] = useState(() => new QueryClient());
  const theme = createTheme({ palette: { mode: 'light' } });
  
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}