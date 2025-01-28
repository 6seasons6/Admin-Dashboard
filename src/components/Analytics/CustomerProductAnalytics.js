import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all necessary components for charts
Chart.register(...registerables);

const CustomerProductAnalytics = () => {
  const customerDemographicsData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55+'], // Age groups
    datasets: [
      {
        label: 'Male',
        data: [30, 40, 25, 15, 10],
        backgroundColor: '#1E90FF', // Blue for Male
      },
      {
        label: 'Female',
        data: [25, 35, 30, 20, 10],
        backgroundColor: '#FF1493', // Pink for Female
      },
      {
        label: 'Other',
        data: [5, 10, 5, 5, 2],
        backgroundColor: '#FFD700', // Gold for Other
      },
      {
        label: 'Urban',
        data: [40, 50, 35, 25, 15],
        backgroundColor: '#32CD32', // Green for Urban
      },
      {
        label: 'Rural',
        data: [15, 25, 15, 10, 5],
        backgroundColor: '#FFA500', // Orange for Rural
      },
    ],
  };

  const churnRateData = {
    labels: ['Active', 'Churned'],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ['#FFA500', '#1E90FF'],
      },
    ],
  };

  const clv = 1400; // Mock CLV value

  // Updated Return Data with product return reasons
  const returnData = {
    labels: ['Product Defect', 'Customer Changed Mind', 'Wrong Size'],
    datasets: [
      {
        label: 'Return Rates',
        data: [15, 8, 12], // Return rates for each reason
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colors for each category
      },
    ],
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {/* Customer Demographics */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '350px', borderRadius: '8px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#4A5568" fontWeight="bold">
                Customer Demographics
              </Typography>
              <Box sx={{ height: 250 }}>
                <Bar data={customerDemographicsData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Churn Rate */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '350px', borderRadius: '8px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#4A5568" fontWeight="bold">
                Churn Rate
              </Typography>
              <Box sx={{ height: 250 }}>
                <Doughnut data={churnRateData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Lifetime Value (CLV) */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '350px', borderRadius: '8px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#4A5568" fontWeight="bold">
                Customer Lifetime Value (CLV)
              </Typography>
              <Typography variant="h4" color="#2D3748" fontWeight="bold" sx={{ marginTop: 5 }}>
                ${clv}
              </Typography>
              <Typography variant="body2" color="#718096" sx={{ marginTop: 2 }}>
                The average revenue a customer contributes over their lifetime.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Return/Refund Data */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '350px', borderRadius: '8px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#4A5568" fontWeight="bold">
                Return & Refund Analysis
              </Typography>
              <Box sx={{ height: 250 }}>
                <Bar
                  data={returnData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        barThickness: 30, // Decrease bar thickness
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerProductAnalytics;
