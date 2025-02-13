import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

// Register all chart components
Chart.register(...registerables);

const SalesAnalytics = () => {
  const { authData } = useAuth(); // Assuming authData contains user token
  const [salesData, setSalesData] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [revenueByRegion, setRevenueByRegion] = useState([]);
  const [expenseData, setExpenseData] = useState([]); // New state for expenses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  // Fetch sales data from the backend
  const fetchSalesData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales', {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setSalesData(response.data);
    } catch (err) {
      console.error('Failed to load sales data:', err);
      setError('Failed to load sales data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch top-selling products
  const fetchTopSellingProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/top-selling', {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setTopSellingProducts(response.data);
    } catch (err) {
      console.error('Failed to load top-selling products:', err);
      setError('Failed to load top-selling products.');
    }
  };

  // Fetch revenue by region
  const fetchRevenueByRegion = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/revenue-by-region', {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setRevenueByRegion(response.data);
    } catch (err) {
      console.error('Failed to load revenue by region:', err);
      setError('Failed to load revenue by region.');
    }
  };

  // Fetch sales analytics
  const fetchSalesAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/analytics', {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setTotalRevenue(response.data.totalRevenue);
      setTotalProfit(response.data.totalProfit);
    } catch (err) {
      console.error('Failed to load sales analytics:', err);
      setError('Failed to load sales analytics.');
    }
  };

  // Fetch expense data
  const fetchExpenseData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setExpenseData(response.data); // Set the fetched expense data
    } catch (err) {
      console.error('Failed to load expense data:', err);
      setError('Failed to load expense data.');
    }
  };

  useEffect(() => {
    fetchSalesData();
    fetchTopSellingProducts();
    fetchRevenueByRegion();
    fetchSalesAnalytics();
    fetchExpenseData(); // Fetch expenses
  }, [authData]);

  // Prepare chart data based on fetched sales data
  const lineChartData = {
    labels: salesData.map(sale => new Date(sale.date).toLocaleDateString()), // Format date for labels
    datasets: [
      {
        label: 'Total Revenue',
        data: salesData.map(sale => sale.totalAmount), // Use totalAmount from sales
        borderColor: '#42A5F5',
        fill: false,
      },
      {
        label: 'Profit Over Time',
        data: salesData.map(sale => {
          const productPrice = sale.productId.price; // Assuming productId has price
          return (productPrice * sale.quantity) - sale.totalAmount; // Calculate profit
        }),
        borderColor: '#66BB6A',
        fill: false,
      },
    ],
  };

  const barChartData = {
    labels: topSellingProducts.map(product => product.productName), // Use product names from top-selling products
    datasets: [
      {
        label: 'Sales Quantity',
        data: topSellingProducts.map(product => product.totalQuantity), // Use total quantity from top-selling products
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043', '#FFD432'],
      },
    ],
  };

  const pieChartData = {
    labels: revenueByRegion.map(region => region._id), // Use region names
    datasets: [
      {
        data: revenueByRegion.map(region => region.totalRevenue), // Use total revenue from each region
        backgroundColor: ['#FF9800', '#4CAF50', '#2196F3', '#FF7043', '#FFD432'],
      },
    ],
  };

  // Prepare pie chart data for expenses
  const pieChartExpenseData = {
    labels: expenseData.map(expense => expense.category), // Use expense categories
    datasets: [
      {
        data: expenseData.map(expense => expense.amount), // Use expense amounts
        backgroundColor: ['#FF9800', '#4CAF50', '#2196F3'], // Colors for each category
      },
    ],
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, flex: 1 }}>
      <Typography variant="h4" gutterBottom>
        Sales Analytics
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
          <Card sx={{ height: '100%', background: '#F0F0F0', borderRadius: '8px', boxShadow: 3 }}>
            <CardContent sx={{ height: 220 }}>
              <Typography variant="h6" gutterBottom>
                Expense Tracking
              </Typography>
              <Pie data={pieChartExpenseData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue by Region */}
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue by Region
              </Typography>
              <Bar data={pieChartData} /> {/* Change this to Bar chart */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesAnalytics;