import React, { useState } from 'react';
import { TextField, Button, Box, Card, CardContent, Typography, Link } from '@mui/material';
import { login } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import loginpic from '../../images/loginpic.jpg';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthData } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password).then((data) => {
      setAuthData(data);
      navigate('/Dashboard');
    });
  };
  const handleLoginSuccess = (credentialResponse) => {
    console.log('Google Sign-In Success:', credentialResponse);
    // Send the token to your backend for verification and further processing
    navigate("./Dashboard");
  };
  const handleLoginFailure = (error) => {
    console.error('Google Sign-In Failed:', error);
  };


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        backgroundImage: `url(${loginpic})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <Card sx={{ width: 400, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div" textAlign="center" marginBottom={2}>
            Login
          </Typography>
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
              sx={{ alignSelf: 'flex-end', fontSize: '0.9rem', marginBottom: 2 }}
            >
              Forgot Password?
            </Link>
            <Button variant="contained" type="submit" color="primary" style={{ width: '5rem',marginLeft: '9rem' }}>
              Login
            </Button>
            <GoogleOAuthProvider clientId="381244195862-6drn1l84isgongnev4ihc7uje5mbqb27.apps.googleusercontent.com">
      <div style={{ textAlign: 'center', marginTop: '50px',marginBottom:'10px' }}>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      </div>
    </GoogleOAuthProvider>
          </Box>
        </CardContent>
      </Card>
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Don't have an account?{' '}
        <Link href="/register" color="red" underline="hover">
          Register Here
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
