import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useAuth } from '../contexts/AuthContext';
//import { getUserData } from '../services/api';

// Register all necessary components for charts
Chart.register(...registerables);

const DashboardApp = () => {
  const { authData } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
         //get the data when user login
        //const mockData = await getUserData(authData.token);
        // Mock data for demonstration
        // Mocking the user data
         const mockData = {
           name: 'Jayanthi Kilari',
           monthlyData: 500,  // Monthly data in units
           dailyData: 20,     // Daily data in hours
           yearlyData: 1500,  // Yearly data in units
          monthlyUsage: [300, 500, 200, 400, 700], // Monthly usage in hours
         };
        setUserData(mockData);
      } catch {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    // useEffect(() => {
  //   // Check if the user is logged in (e.g., by checking the token in localStorage)
  //   const authToken = localStorage.getItem('googleAuthToken');
  //   if (!authToken) {
  //     // If not logged in, redirect to the login page
  //     navigate('/');
  //   }
  // }, [navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#D3D3D3', // Gray background color
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#D3D3D3', // Gray background color
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  const doughnutData = {
    labels: ['Monthly', 'Daily', 'Yearly'],
    datasets: [
      {
        data: [userData.monthlyData, userData.dailyData, userData.yearlyData],
        backgroundColor: ['#6FBF73', '#85D6F7', '#FF9F8C'], // Light pastel colors
      },
    ],
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Monthly Usage (hrs)',
        data: userData.monthlyUsage,
        backgroundColor: ['#D4F1F4', '#FFB6B9', '#D5E1E1', '#B8E0D2', '#F4E1D2'], // Light pastel colors
        barThickness: 25, // Reduced width of bars
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#4A5568', // Dark text color for legend
        },
      },
    },
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#D3D3D3' }}> {/* Gray background */}
      <Box sx={{ flex: 1, padding: 3, color: '#2D3748' }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {userData.name}
        </Typography>
        <Grid container spacing={3}>
          {/* Cards for Monthly, Daily, Yearly Data */}
          {['Monthly Data', 'Daily Data', 'Yearly Data'].map((label, idx) => {
            const data =
              idx === 0
                ? `${userData.monthlyData} units`  // Monthly data in units
                : idx === 1
                ? `${userData.dailyData} hours`  // Daily data in hours
                : `${userData.yearlyData} units`; // Yearly data in units
            return (
              <Grid item xs={12} sm={4} key={idx}>
                <Card sx={{ height: '100%', background: '#F0F0F0', borderRadius: '8px', boxShadow: 3 }}> {/* Light gray for cards */}
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="#A0AEC0">
                      {label}
                    </Typography>
                    <Typography variant="h4" color="#2D3748">
                      {data}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

          {/* Doughnut Chart for Data Distribution */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%', background: '#F0F0F0', borderRadius: '8px', boxShadow: 3 }}> {/* Light gray for cards */}
              <CardContent>
                <Typography variant="h6" gutterBottom color="#A0AEC0">
                  Data Distribution
                </Typography>
                <Box sx={{ height: 250 }}>
                  <Doughnut data={doughnutData} options={graphOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Bar Chart for Monthly Usage */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%', background: '#F0F0F0', borderRadius: '8px', boxShadow: 3 }}> {/* Light gray for cards */}
              <CardContent>
                <Typography variant="h6" gutterBottom color="#A0AEC0">
                  Monthly Usage
                </Typography>
                <Box sx={{ height: 250 }}>
                  <Bar data={barData} options={graphOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardApp;
