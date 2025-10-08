'use client';
import { useQuery } from '@tanstack/react-query';
import { gqlTransactions, TxEdge } from '@/lib/gql';
import { useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Stack } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function TransactionsPage() {
  const router = useRouter();
  
  const authed = Boolean(Cookies.get('token'));
  if (!authed && typeof window !== 'undefined') {
    router.replace('/login');
  }

  const [after, setAfter] = useState<string | undefined>(undefined);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['transactions', after],
    queryFn: () => gqlTransactions(10, after),
  });

  const edges: TxEdge[] = data?.transactions?.edges ?? [];
  const pageInfo = data?.transactions?.pageInfo;

  return (
    <main style={{ padding: 24 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Transactions</Typography>
        <Stack direction="row" spacing={1}>
          <Button 
            size="small" 
            onClick={() => { setAfter(undefined); refetch(); }}
          >
            First page
          </Button>
          <Button 
            size="small" 
            disabled={!pageInfo?.hasNextPage || isFetching}
            onClick={() => setAfter(pageInfo?.endCursor ?? undefined)}
          >
            Next
          </Button>
        </Stack>
      </Stack>

      {isLoading ? 'Loading…' : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {edges.map(e => (
                <TableRow key={e.cursor}>
                  <TableCell>{e.node.id}</TableCell>
                  <TableCell align="right">{(e.node.amountCents/100).toFixed(2)}</TableCell>
                  <TableCell>{e.node.currency}</TableCell>
                  <TableCell>{e.node.status}</TableCell>
                  <TableCell>{new Date(e.node.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </main>
  );
}
