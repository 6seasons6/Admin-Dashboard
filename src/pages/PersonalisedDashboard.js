// src/pages/PersonalisedDashboard.js
import React, { useEffect, useState } from 'react';

import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useAuth } from '../contexts/AuthContext';
//import { getUserData } from '../services/api';
import { getUserData } from '../services/api';
import { useNavigate } from 'react-router-dom';
import SalesAnalytics from '../components/Analytics/SalesAnalytics';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from '@mui/material';
// Register all necessary components for charts
Chart.register(...registerables);
 
const DashboardApp = () => {
  const { authData } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);  // Product list state
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal visibility
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', stock: '' });
  // const [selectedProduct, setSelectedProduct] = useState(null); // Selected product for detailed view
  const [search, setSearch] = useState('');  // Search state
  const [filterCategory, setFilterCategory] = useState('');  // Category filter
  const [filterStock, setFilterStock] = useState('');  // Stock filter 
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
         // Mock product data
         setProducts([
          { id: 1, name: 'Product A', price: 50, category: 'Category 1', stock: 5 },
          { id: 2, name: 'Product B', price: 30, category: 'Category 2', stock: 1 },
          { id: 3, name: 'Product C', price: 20, category: 'Category 1', stock: 0 },
        ]);
      } catch {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, []);
  const handleAddProduct = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProduct = () => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setIsModalOpen(false);
    setNewProduct({ name: '', price: '', category: '', stock: '' });  // Clear form
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleEditProduct = (id) => {
    const product = products.find((p) => p.id === id);
    setNewProduct(product);
    setIsModalOpen(true);
  };
  const handleReorderProduct = (id) => {
    // Simulate reordering by increasing the stock of the selected product.
    setProducts((prevProducts) => 
      prevProducts.map((product) =>
        product.id === id ? { ...product, stock: product.stock + 10 } : product  // Increase stock by 10
      )
    );
  };
  // const handleReorderProduct = (id) => {
  //   const product = products.find((p) => p.id === id);
  //   setNewProduct(product);
  //   setIsModalOpen(true);
  // };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleStockFilterChange = (e) => {
    setFilterStock(e.target.value);
  };
  // const handleReorderProduct = (id) => {
  //   setProducts(products.filter((product) => product.id !== id));
  // };
  
  // const handleProductClick = (product) => {
  //   setSelectedProduct(product);
  
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? product.category === filterCategory : true;
    const matchesStock =
      filterStock === '' ? true : filterStock === 'low' ? product.stock <= 5 : product.stock > 5;
    return matchesSearch && matchesCategory && matchesStock;
  });

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
       </Typography>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',  // Ensure content is stacked vertically
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      }}
    >
      <Box sx={{ flex: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom color="white">
 
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
    {/* Product Catalog Management */}
    <Box sx={{ padding: 3 }}>
    <Typography variant="h5" gutterBottom   sx={{ color: '#FFFFFF' }}>
       Product Catalog Management   
    </Typography>
    {/* Add New Product Button */}
    <Button variant="contained" color="primary" onClick={handleAddProduct}>
      Add New Product
    </Button>

    {/* Search & Filters */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2  , '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' } }}>
      <TextField
        label="Search Products"
        value={search}
        onChange={handleSearchChange}
        fullWidth
        sx={{ marginRight: 2 }}
        InputLabelProps={{
          style: { color: '#FFFFFF' }  // Set label color to white
        }}
      />
      <FormControl sx={{ minWidth: 150,   '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' } }}>
        <InputLabel sx={{ color: '#FFFFFF' }}>Category </InputLabel>
        <Select value={filterCategory} onChange={handleCategoryFilterChange}>
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="Category 1">Category 1</MenuItem>
          <MenuItem value="Category 2">Category 2</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 150, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' } }}>
        <InputLabel  sx={{ color: '#FFFFFF' }}>Stock Status </InputLabel>
        <Select value={filterStock} onChange={handleStockFilterChange}>
          <MenuItem value="">All Stock</MenuItem>
          <MenuItem value="low">Low Stock</MenuItem>
          <MenuItem value="high">High Stock</MenuItem>
        </Select>
      </FormControl>
    </Box>
    {/* Product List */}
    <Grid container spacing={3} sx={{ marginTop: 2 }}>
      {filteredProducts.map((product) => (
        <Grid item xs={12} sm={4} key={product.id}>
          <Card sx={{ height: '100%', background: '#F0F0F0', borderRadius: '8px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2">Price: ${product.price}</Typography>
              <Typography variant="body2">Category: {product.category}</Typography>
              <Typography variant="body2">Stock: {product.stock}</Typography>

              {/* Edit and Delete Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button variant="outlined" onClick={() => handleEditProduct(product.id)}>
                  Edit
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </Button>
            {product.stock <= 5 && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleReorderProduct(product.id)} > 
                Reorder
              </Button>
            )}
             </Box>
             </CardContent>
           </Card>
         </Grid>
       ))}
     </Grid>
   </Box>

  {/* Modal to Add/Edit Product */}
  <Modal open={isModalOpen} onClose={handleCloseModal}>
    <Box sx={{ padding: 3, width: 400, margin: 'auto', backgroundColor: 'white', borderRadius: 2 }}>
      <Typography variant="h6">{newProduct.id ? 'Edit Product' : 'Add New Product'}</Typography>
      <TextField
        label="Product Name"
        fullWidth
        name="name"
        value={newProduct.name}
        onChange={handleProductChange}
        sx={{ marginTop: 2 }}
      />
      <TextField
        label="Price"
        fullWidth
        name="price"
        type="number"
        value={newProduct.price}
        onChange={handleProductChange}
        sx={{ marginTop: 2 }}
      />
      <TextField
        label="Category"
        fullWidth
        name="category"
        value={newProduct.category}
        onChange={handleProductChange}
        sx={{ marginTop: 2 }}
      />
      <TextField
        label="Stock"
        fullWidth
        name="stock"
        type="number"
        value={newProduct.stock}
        onChange={handleProductChange}
        sx={{ marginTop: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button variant="outlined" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSaveProduct}>
          Save
        </Button>
      </Box>
    </Box>
  </Modal>
   
   
   
        {/* Sales Analytics Sidebar or Below Section */}
      <Box sx={{ display: 'flex', flexDirection: 'row', padding: 3 }}>
        {/* If you want a sidebar layout */}
        <Box sx={{ flex: 3, paddingRight: 3 }}>
          <SalesAnalytics />
        </Box>
 
        {/* If you want it below the product management */}
        {/* <SalesAnalytics /> */}
      </Box>
    </Box>
    // </Box>
    // </Box>
   
   
      );
};
 
export default DashboardApp;
 
