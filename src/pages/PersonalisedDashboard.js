import React, { useEffect, useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useAuth } from '../contexts/AuthContext'; // Context for authentication
import axios from 'axios'; // For API requests
// import { useNavigate } from 'react-router-dom';
import SalesAnalytics from '../components/Analytics/SalesAnalytics';
import CustomerProductAnalytics from '../components/Analytics/CustomerProductAnalytics';
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
  Link,
} from '@mui/material';
import '../components/Sidebar';
 
// import { Description } from '@mui/icons-material';
// Register all necessary components for charts
Chart.register(...registerables);
 
const DashboardApp = () => {
  const { authData } = useAuth(); // Assuming authData contains user token
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]); // Product list state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', stock: '' });
  const [search, setSearch] = useState(''); // Search state
  const [filterCategory, setFilterCategory] = useState(''); // Category filter
  const [filterStock, setFilterStock] = useState(''); // Stock filter
  const [usageData, setUsageData] = useState({ daily: 0, monthly: 0, yearly: 0 }); // Usage data
  // const [screenTime, setScreenTime] = useState(0); // Track screen time
  const [startTime, setStartTime] = useState(null); // Track session start time
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const response = await axios.get('/api/user', {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
 
        const userName = response.data.name;
 
        setUserData({ name: userName });
 
        // Track screen time
        const start = Date.now();
        setStartTime(start);
 
        // Handle screen time tracking on page unload
        const userId = authData?.user?.id || authData?.user?._id;
        window.onbeforeunload = () => {
          const end = Date.now();
          const timeSpent = (end - start) / 1000/60/60; // Convert ms to hours
          if (timeSpent > 0) {
            axios.post(
              'http://localhost:5000/api/track-usage',
              {
                userId,
                sessionDuration: timeSpent,
              },
              {
                headers: { Authorization: `Bearer ${authData.token}` },
              }
            );
          }
        };
 
        // Fetch usage data
        const fetchUsageData = async () => {
          const userId = authData?.user?.id || authData?.user?._id;
          if (!userId) {
            console.error('User ID is missing or undefined');
            return;
          }
          try {
            const response = await axios.get(`http://localhost:5000/api/usage?userId=${userId}`, {
              headers: { Authorization: `Bearer ${authData.token}` },
            });
            const { daily, monthly, yearly } = response.data;
            setUsageData({ daily, monthly, yearly });
          } catch (error) {
            console.error('Failed to load usage data', error);
          }
        };
 
        fetchUsageData();
 
        // Fetch products (mocked for now)
        setProducts([
          { id: 1, name: 'Product A', price: 50, category: 'Category 1', stock: 5 },
          { id: 2, name: 'Product B', price: 30, category: 'Category 2', stock: 1 },
          { id: 3, name: 'Product C', price: 20, category: 'Category 1', stock: 0 },
        ]);
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
 
    // Cleanup the event listener
    return () => {
      window.onbeforeunload = null;
    };
  }, [authData]);
 
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
    setNewProduct({ name: '', price: '', category: '', stock: '' });
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
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, stock: product.stock + 10 } : product
      )
    );
  };
 
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
 
  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };
 
  const handleStockFilterChange = (e) => {
    setFilterStock(e.target.value);
  };
 
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? product.category === filterCategory : true;
    const matchesStock =
      filterStock === '' ? true : filterStock === 'low' ? product.stock <= 5 : product.stock > 5;
    return matchesSearch && matchesCategory && matchesStock;
  });
 
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#F5F5F5',
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
          background: '#F5F5F5',
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
        data: [usageData.monthly, usageData.daily, usageData.yearly],
        backgroundColor: ['#6FBF73', '#85D6F7', '#FF9F8C'],
      },
    ],
  };
 
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Monthly Usage (hrs)',
        data: [usageData.monthly, usageData.monthly, usageData.monthly, usageData.monthly, usageData.monthly], // Replace with actual monthly data
        backgroundColor: ['#D4F1F4', '#FFB6B9', '#D5E1E1', '#B8E0D2', '#F4E1D2'],
        barThickness: 25,
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
          color: '#4A5568',
        },
      },
    },
  };
 
  return (
     <Box sx={{ display: 'flex', flexDirection:'column',minHeight: '100vh', background: '#bcaaa4 ' }}>
      <Box sx={{ flex: 1, padding: 3, color: '#2D3748' }}>
        <Typography variant="h4" gutterBottom></Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #A2D5AB, #F8C7B6)',
          }}
        >
         <Box sx={{  minHeight: '100vh', background: 'linear-gradient(135deg, #A2D5AB, #F8C7B6)',
 
 }}>
          <Box sx={{ flex: 1, padding: 3, color: 'A2D5AB' }}>
            <Typography variant="h4" gutterBottom color="A0AEC0">
              Welcome, {userData.name}
            </Typography>
            <Grid container spacing={3}>
              {['Monthly Data', 'Daily Data', 'Yearly Data'].map((label, idx) => {
                const data =
                  idx === 0
                    ? `${usageData.monthly} hours`
                    : idx === 1
                    ? `${usageData.daily} hours`
                    : `${usageData.yearly} hours`;
                const colors = [
                  '#fff9c4',
                  '#b9f6ca',
                  '#ffe0b2',
                ];
                return (
                  <Grid item xs={12} sm={4} key={idx}>
                    <Card sx={{ height: '100%', backgroundColor: colors[idx], borderRadius: '8px', boxShadow: 3  }}>
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
 
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%', background: '#F0F0F0', borderRadius: '8px', boxShadow: 3 }}>
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
 
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%', background: '#F0F0F0', borderRadius: '8px', boxShadow: 3 }}>
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
 
          <Box sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'black' }}>
              Product Catalog Management
            </Typography>
            {/* Add New Product Button */}
            <Button variant="contained" color="primary" onClick={handleAddProduct}>
              Add New Product
            </Button>
 
            {/* Search & Filters */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 2,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' },
              }}
            >
              <TextField
                label="Search Products"
                value={search}
                onChange={handleSearchChange}
                fullWidth
                sx={{ marginRight: 2 }}
                InputLabelProps={{
                  style: { color: 'black' }, // Set label color to white
                }}
              />
              <FormControl sx={{ minWidth: 150, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' } }}>
                <InputLabel sx={{ color: 'black' }}>Category </InputLabel>
                <Select value={filterCategory} onChange={handleCategoryFilterChange}>
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="Category 1">Category 1</MenuItem>
                  <MenuItem value="Category 2">Category 2</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 150, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' } }}>
                <InputLabel sx={{ color: 'black' }}>Stock Status </InputLabel>
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
                          <Button variant="contained" color="warning" onClick={() => handleReorderProduct(product.id)}>
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
 
          {/* Sales Analytics */}
          <Box sx={{ display: 'flex', flexDirection: 'row', padding: 3 }}>
            {/* If you want a sidebar layout */}
            <Box sx={{ flex: 3, paddingRight: 3 }}>
              <SalesAnalytics />
            </Box>
 
            {/* If you want it below the product management */}
            {/* <SalesAnalytics /> */}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', padding: 3 }}>
            <Box sx={{ flex: 3, paddingRight: 3 }}>
              <CustomerProductAnalytics /> {/* Added CustomerProductAnalytics */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>

    {/* footer */}
    <Box
  sx={{
    backgroundColor: 'lightgrey', // Dark background
    color: 'black',
    padding: 4,
    marginTop: 'auto', // Pushes footer to the bottom
  }}
>
  <Grid container spacing={3} justifyContent="space-around">
    {/* Business Time Column */}
    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="h6" gutterBottom>
        Business Time
      </Typography>
      <Typography variant="body2" display="block">
        Monday - Friday: 08.00am to 05.00pm
      </Typography>
      <Typography variant="body2" display="block">
        Saturday: 10.00am to 08.00pm
      </Typography>
      <Typography variant="body2" display="block">
        Sunday: Closed
      </Typography>
    </Grid>

    {/* Newsletter Column */}
    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="h6" gutterBottom>
        Newsletter
      </Typography>
      <TextField
        fullWidth
        placeholder="Email Address*"
        variant="outlined"
        size="small"
        sx={{
          backgroundColor: 'white',
          borderRadius: '4px',
          marginBottom: 2,
        }}
      />
      <Button variant="contained" color="primary">
        Subscribe
      </Button>
    </Grid>

    {/* Social Media Column */}
    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="h6" gutterBottom>
        Social Media
      </Typography>
      <Typography variant="body2" display="block" sx={{ marginBottom: 2 }}>
        Follow us for updates on seasonal and organic products.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* <Link href="#" color="inherit">
          <Typography variant="body2">Facebook</Typography>
        </Link>
        <Link href="#" color="inherit">
          <Typography variant="body2">Twitter</Typography>
        </Link>
        <Link href="#" color="inherit">
          <Typography variant="body2">Instagram</Typography>
        </Link> */}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} color="black" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={24} color="black" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} color="black" />
            </a>
      </Box>
    </Grid>

    {/* About 6seasonsorganic Column */}
    {/* <Grid item xs={12} sm={6} md={3}>
      <Typography variant="h6" gutterBottom>
        About 6seasonsorganic
      </Typography>
      <Typography variant="body2" display="block" sx={{ marginBottom: 2 }}>
        6seasonsorganic is dedicated to providing the highest quality organic and seasonal products. Our mission is to bring health and sustainability to every customer.
      </Typography>
      <Typography variant="body2" display="block">
        Our organic products are sourced with care, ensuring the best for you and your family.
      </Typography>
    </Grid> */}
  </Grid>

  {/* Information and Contact Section */}
  <Box
    sx={{
      borderTop: '1px solid rgba(255, 255, 255, 0.58)',
      paddingTop: 4,
      marginTop: 4,
    }}
  >
    <Grid container spacing={4} marginLeft="30px">
      {/* Information Column */}
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="h6" gutterBottom>
          Information
        </Typography>
        <Link href="#" color="inherit" underline="hover" display="block">
          About Us 
        </Link>
        <Link href="#" color="inherit" underline="hover" display="block">
          Customer Service
        </Link>
        <Link href="#" color="inherit" underline="hover" display="block">
          Our Sitemap
        </Link>
        <Link href="#" color="inherit" underline="hover" display="block">
          Terms & Conditions
        </Link>
        <Link href="#" color="inherit" underline="hover" display="block">
          Privacy Policy
        </Link>
        <Link href="#" color="inherit" underline="hover" display="block">
          Delivery Information
        </Link>
      </Grid>

      {/* Contact Us Column */}
      <Grid item xs={12} sm={6} md={3} marginLeft="100px">
        <Typography variant="h6" gutterBottom>
          Contact Us
        </Typography>
        
        <Typography variant="body2" display="block" style={{ lineHeight: "2" }}>
          Address: 6seasonsorganic H.no 4-59/6/19,
        </Typography>
        <Typography variant="body2" display="block" style={{ lineHeight: "2" }}>
          Srinivasa Nagar Colony Mandaipally Road
        </Typography>
        <Typography variant="body2" display="block" style={{ lineHeight: "2" }}>
          Thumukunta, Shamirpet
        </Typography>
        <Typography variant="body2" display="block" style={{ lineHeight: "2" }}>
          Secunderabad, Telangana 500078
        </Typography>
        <Typography variant="body2" display="block" style={{ lineHeight: "2" }}>
          Phone: +91-9100066659
        </Typography>
        <Typography variant="body2" display="block" style={{ lineHeight: "2" }}>
          Email: info@6seasonsorganic.com
        </Typography>
        
      </Grid>
    </Grid>
  </Box>

  {/* Copyright Section */}
  <Box
    sx={{
      textAlign: 'center',
      marginTop: 4,
      paddingTop: 2,
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    }}
  >
    <Typography variant="body2">
      All Rights Reserved. © 2023 6SeasonsOrganic
    </Typography>
    <Typography variant="body2" sx={{ marginTop: 1 }}>
      Design By: 6SeasonsOrganic
    </Typography> 
  </Box>
</Box>
    </Box>
    // </Box>

    
  );
};
 
export default DashboardApp;