import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [email, setEmail] = useState('admin@runads.com');
  const [password, setPassword] = useState('admin123');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch {
      // Error is handled by RTK Query
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Run-Ads
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            textAlign="center"
          >
            Admin Dashboard
          </Typography>

          {!!error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Invalid email or password
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            textAlign="center"
            sx={{ mt: 3 }}
          >
            Default: admin@runads.com / admin123
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
