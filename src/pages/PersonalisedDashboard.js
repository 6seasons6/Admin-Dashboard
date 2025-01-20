import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress} from '@mui/material';
import { getUserData } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

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
        const data = await getUserData(authData.token);
        setUserData(data);
      } catch {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authData.token]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
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
          background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
        }}
      >
        <Typography variant="h6" color="white">
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
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
      },
    ],
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Data Usage',
        data: userData.monthlyUsage,
        backgroundColor: '#42A5F5',
      },
    ],
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #6a11cb, #2575fc)' }}>
      
      {/* Dashboard Content */}
      <Box sx={{ flex: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom color="white">
          Welcome, {userData.name}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Data
                </Typography>
                <Typography>{userData.monthlyData}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Daily Data
                </Typography>
                <Typography>{userData.dailyData}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Yearly Data
                </Typography>
                <Typography>{userData.yearlyData}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Data Distribution
                </Typography>
                <Doughnut data={doughnutData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Usage
                </Typography>
                <Bar data={barData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardApp;