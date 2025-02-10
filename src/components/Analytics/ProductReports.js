import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const ProductReports = () => {
  const { authData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch products with timestamps and associated user details
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setProducts(response.data);
      setFilteredProducts(response.data); // Initialize filtered products
    } catch (err) {
      setError('Failed to load products.');
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [authData]);

  // Filter products by month and year
  useEffect(() => {
    const filtered = products.filter((product) => {
      const productDate = new Date(product.createdAt);
      return (
        productDate.getMonth() + 1 === selectedMonth &&
        productDate.getFullYear() === selectedYear
      );
    });
    setFilteredProducts(filtered);
  }, [selectedMonth, selectedYear, products]);

  // Count products created by each user
  const countProductsByUser = () => {
    const userProductCount = {};
    filteredProducts.forEach((product) => {
      const userName = product.userId?.username || 'Unknown'; // Handle missing username
      if (!userProductCount[userName]) {
        userProductCount[userName] = 0; // Initialize count
      }
      userProductCount[userName] += 1; // Increment count
    });
    console.log("User Product Counts:", userProductCount); // Debugging output
    return userProductCount;
  };

  const userProductCounts = countProductsByUser();

  // Prepare data for the bar chart (Number of Products by User)
  const barData = {
    labels: Object.keys(userProductCounts), // Usernames
    datasets: [
      {
        label: 'Number of Products',
        data: Object.values(userProductCounts), // Product count per user
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        barThickness: 35,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Products Created per User',
      },
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f0f0f0',
        }}
      >
        <CircularProgress />
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
          backgroundColor: '#f0f0f0',
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f0f0f0' }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 3 }}>
    Product Reports
  </Typography>

      {/* Filters for Month and Year */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            label="Month"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            label="Year"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Bar Chart (Products by User) */}
      <Box sx={{ marginBottom: 6, display: 'flex', justifyContent: 'left' }}>
        <Box sx={{ width: '75%', height: '400px' }}>
          <Typography variant="h6" gutterBottom>
            Number of Products Created per User
          </Typography>
          <Bar data={barData} options={barOptions} />
        </Box>
      </Box>

      {/* Table of Users and Product Counts */}
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
        Users and Products Count
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell sx={{ borderRight: '2px solid #ccc', fontWeight: 'bold' }}>User Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Products Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(userProductCounts).map(([userName, count]) => (
              <TableRow key={userName} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                <TableCell sx={{ borderRight: '2px solid #ccc' }}>{userName}</TableCell>
                <TableCell sx={{ borderRight: '2px solid #ccc' }}>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductReports;
