import React, { useState } from 'react';
import { TextField, Button, Box, Card, CardContent, Typography,Link } from '@mui/material';
import { forgotPassword } from '../../services/api'; // Adjust path to match your project structure

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      const response = await forgotPassword(email); // Call the API
      if (response.success) {
        setMessage('A password reset link has been sent to your email address.');
      } else {
        setMessage(response.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Failed to reset password');
    }
    setEmail(''); // Clear the email field
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2,
      }}
    >
      <Card sx={{ width: 400, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" marginBottom={2}>
            Forgot Password
          </Typography>
          {message && (
            <Typography
              color={message.includes('Please') || message.includes('Failed') ? 'error' : 'green'}
              textAlign="center"
              marginBottom={2}
            >
              {message}
            </Typography>
          )}
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
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <Button variant="contained" type="submit" color="primary" style={{ width: '10rem',marginLeft: '6rem' }}>
              Send Reset Link
            </Button>
          </Box>
        </CardContent>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
        Back to Login?{' '}
        <Link href="/login" color="red"underline="hover">
          Login Here
        </Link>
      </Typography>
      </Card>
     
    </Box>
    
  );
};

export default ForgotPassword;
