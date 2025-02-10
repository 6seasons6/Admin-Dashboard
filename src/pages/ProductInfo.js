import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ProductInfo = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Get the token from local storage
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` }, // Include token in the request
        });
        setProducts(response.data); // Set the products in state
      } catch (err) {
        setError('Failed to fetch products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product Name</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell><strong>Added By</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => {
              return (
                <TableRow key={product._id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{ product.userId.username} </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductInfo;