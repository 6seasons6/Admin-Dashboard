import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all chart components
Chart.register(...registerables);

const SalesAnalytics = () => {
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Revenue',
        data: [1000, 2000, 1500, 2500, 3000, 3500],
        borderColor: '#42A5F5',
        fill: false,
      },
      {
        label: 'Profit Over Time',
        data: [500, 1200, 900, 1800, 2200, 2700],
        borderColor: '#66BB6A',
        fill: false,
      },
    ],
  };

  const barChartData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    datasets: [
      {
        label: 'Top Selling Products',
        data: [5000, 4000, 6000, 3000],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043'],
      },
    ],
  };

  const pieChartData = {
    labels: ['Marketing', 'Shipping', 'Raw Materials'],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: ['#FF9800', '#4CAF50', '#2196F3'],
      },
    ],
  };

  return (
    <Box sx={{ padding: 3, flex: 1 }}>
      <Typography variant="h4" gutterBottom>
      </Typography>

      <Grid container spacing={3}>
        {/* Revenue & Profit Over Time */}
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Revenue & Profit Over Time
              </Typography>
              <Line data={lineChartData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Top Selling Products */}
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Selling Products
              </Typography>
              <Bar data={barChartData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Expense Tracking */}
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expense Tracking
              </Typography>
              <Pie data={pieChartData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue by Region or Category (Optional) */}
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue by Region/Product Category
              </Typography>
              {/* You can add more charts here */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesAnalytics;