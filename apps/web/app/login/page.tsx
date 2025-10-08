'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Stack, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { gqlLogin } from '@/lib/gql';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({ 
  email: z.email(), 
  password: z.string().min(6) 
});
type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const token = await gqlLogin(data.email, data.password);
      Cookies.set('token', token, { sameSite: 'lax' });
      router.push('/transactions');
    } catch (e: any) {
      console.error(e?.errors);

      setError(e?.message ?? 'Login failed');
    }
  };

  return (
    <main style={{ maxWidth: 420, margin: '64px auto', padding: 16 }}>
      <Typography variant="h4" gutterBottom>Merchant Buddy</Typography>
      <Typography variant="body1" gutterBottom>Sign in</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField label="Email" {...register('email')} />
          <TextField label="Password" type="password" {...register('password')} />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </Stack>
      </form>
      <Typography variant="caption" display="block" sx={{ mt: 2, opacity: 0.7 }}>
        Use owner@mb.local / Owner123!#
      </Typography>
    </main>
  );
}
