import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent, Link } from '@mui/material';
import { register } from '../../services/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import img3 from '../../images/img3.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setSuccessMessage('');
      return;
    }

    try {
      await register(username, email, password);
      setSuccessMessage('Registration successful!');
      setErrorMessage('');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      navigate('/login'); // Redirect to login page
    } catch (error) {
      setErrorMessage('User already registered');
      setSuccessMessage('');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundImage: `url(${img3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', padding: 2 }}>
        <Typography
          variant="h5"
          component="div"
          align="center"
          color="green"
          sx={{ marginBottom: 2 }}
        >
          Registration Form
        </Typography>
        <CardContent>
          {successMessage && <Typography color="green">{successMessage}</Typography>}
          {errorMessage && <Typography color="red">{errorMessage}</Typography>}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button variant="contained" type="submit" style={{ width: '5rem', marginLeft: '9rem' }}>
              Register
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Already have an account?{' '}
        <Link href="/login" color="red" underline="hover">
          Login Here
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;