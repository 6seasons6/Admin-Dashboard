import React, { useState } from 'react';
import { TextField, Button, Box, Card, CardContent, Typography, Link } from '@mui/material';
import { login } from '../../services/api'; // Replace with your API call
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setAuthData } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password); // Call API
      setAuthData({ token: data.token, user: data.user });
      localStorage.setItem('authToken', data.token); // Save token locally
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#282c34',
      }}
    >
      <Card sx={{ width: 400, padding: 3, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)' }}>
        <CardContent>
          <Typography variant="h4" textAlign="center" marginBottom={2} color="#673ab7">
            Login
          </Typography>
          {errorMessage && <Typography color="error" textAlign="center">{errorMessage}</Typography>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Link
              href="/forgot-password"
              color="primary"
              underline="hover"
              sx={{ alignSelf: 'flex-end', fontSize: '0.9rem' }}
            >
              Forgot Password?
            </Link>
            <Button variant="contained" type="submit" color="primary" sx={{ width: '100%' }}>
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Typography variant="body2" sx={{ marginTop: 2, color: 'white' }}>
        Don't have an account?{' '}
        <Link href="/register" color="secondary" underline="hover">
          Register Here
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;