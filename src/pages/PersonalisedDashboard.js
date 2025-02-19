import React, { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useAuth } from '../contexts/AuthContext'; // Context for authentication
import axios from 'axios'; // For API requests
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import the check circle 
import '../components/Sidebar';

// Register all necessary components for charts
Chart.register(...registerables);

const DashboardApp = ({searchQuery,setSearchQuery}) => {
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
  const [screenTime, setScreenTime] = useState(0); // Track screen time
  const [startTime, setStartTime] = useState(null); // Track session start time
  const [message, setMessage] = useState(''); // State for messages
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar open/close
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State for Snackbar message
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  //const [filteredProducts, setFilteredProducts] = useState(products);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/products', {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

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
          const timeSpent = (end - start) / 1000 / 60 / 60; // Convert ms to hours
          if (timeSpent > 0) {
            axios.post(
              'http://localhost:5001/api/track-usage',
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
            const response = await axios.get(`http://localhost:5001/api/usage?userId=${userId}`, {
              headers: { Authorization: `Bearer ${authData.token}` },
            });
            const { daily, monthly, yearly } = response.data;
            setUsageData({ daily, monthly, yearly });
          } catch (error) {
            console.error('Failed to load usage data', error);
          }
        };

        fetchUsageData();

        // Fetch products 
        fetchProducts();
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

  const handleSaveProduct = async () => {
    setErrorMessage('');

    if (!newProduct.name || !newProduct.price || !newProduct.category || newProduct.stock === '') {
      setSnackbarMessage('All fields are required.');
      setSnackbarOpen(true);
      return;
    }

    try {
      let response;
      if (newProduct._id) {
        response = await axios.put(`http://localhost:5001/api/products/${newProduct._id}`, newProduct, {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
      } else {
        response = await axios.post('http://localhost:5001/api/products', newProduct, {
          headers: { Authorization: `Bearer ${authData.token}` },
        });

      }
      console.log("Product saved:", response.data);
      setProducts((prev) =>
        newProduct._id
          ? prev.map((p) => (p._id === newProduct._id ? { ...newProduct } : p))
          : [...prev, { ...newProduct, _id: prev.length + 1 }]
      );
      fetchProducts();
      setSnackbarMessage(newProduct._id ? 'Product updated successfully!' : 'Product added successfully!');
      setSnackbarOpen(true);
      setIsModalOpen(false);
      setNewProduct({ name: '', price: '', category: '', stock: '' });
    } catch (error) {
      setSnackbarMessage('Failed to save product.');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteProduct = async (id) => {
    console.log("token", `${authData.token}`)
    try {
      const response = await axios.delete(`http://localhost:5001/api/products/${id}`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      fetchProducts();
      setSnackbarMessage('Product deleted successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to delete product:', error.response ? error.response.data : error.message);
    }
  };

  const handleEditProduct = (id) => {
    const product = products.find((p) => p._id === id);
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
    setSearchQuery(e.target.value); 
  };
 

  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleStockFilterChange = (e) => {
    setFilterStock(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const productName = product.name ? product.name.toLowerCase() : '';
    const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory ? product.category === filterCategory : true;
    const matchesStock =
      filterStock === '' ? true : filterStock === 'low' ? product.stock <= 50 : product.stock > 50;
    return matchesSearch && matchesCategory && matchesStock;
  });
  

  // Conditional check for showing only filtered products
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

  const colors = ['#6FBF73', '#85D6F7', '#FF9F8C']; // Colors for the cards

  return (
    
     
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'white',
          }}
        >
      
   {/* Show Products at the Top **ONLY if Search is Performed** */}
  {searchQuery.trim() !== "" && filteredProducts.length > 0 && (
    <Grid container spacing={3} sx={{ marginTop: 2 }}>
      {filteredProducts.map((product) => (
        <Grid item xs={12} sm={4} key={product._id}>
          <Card sx={{ height: '100%', background: '#F0F0F0', borderRadius: '8px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2">Price: ${product.price}</Typography>
              <Typography variant="body2">Category: {product.category}</Typography>
              <Typography variant="body2">Stock: {product.stock}</Typography>

              {/* Edit and Delete Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button variant="outlined" onClick={() => handleEditProduct(product._id)}>
                  Edit
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDeleteProduct(product._id)}>
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
  )}
  
  <Box sx={{ minHeight: '100vh', background: 'white' }}>
            <Box sx={{ flex: 1, padding: 3, color: '#A0AEC0' }}>
              <Typography variant="h4" gutterBottom color="#A0AEC0">
                Welcome, {userData.name}
              </Typography>
              <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} >
                <MuiAlert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                  <CheckCircleIcon sx={{ fontSize: 20, marginRight: 1 }} />
                  {snackbarMessage}
                </MuiAlert>
              </Snackbar>

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
                      <Card sx={{ height: '100%', backgroundColor: colors[idx], borderRadius: '8px', boxShadow: 3 }}>
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
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                  sx={{ marginRight: 2 }}
                  InputLabelProps={{
                    style: { color: 'black' }, // Set label color to white
                  }}
                />
                <FormControl sx={{ minWidth: 150, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' } }}>
                  <InputLabel sx={{ color: 'black' }}>Category</InputLabel>
                  <Select value={filterCategory} onChange={handleCategoryFilterChange}>
                    <MenuItem value="">All Categories</MenuItem>
                    <MenuItem value="Category 1">Category 1</MenuItem>
                    <MenuItem value="Category 2">Category 2</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 150, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' } }}>
                  <InputLabel sx={{ color: 'black' }}>Stock Status</InputLabel>
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
                  <Grid item xs={12} sm={4} key={product._id}>
                    <Card sx={{ height: '100%', background: '#F0F0F0', borderRadius: '8px', boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography variant="body2">Price: ${product.price}</Typography>
                        <Typography variant="body2">Category: {product.category}</Typography>
                        <Typography variant="body2">Stock: {product.stock}</Typography>

                        {/* Edit and Delete Actions */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                          <Button variant="outlined" onClick={() => handleEditProduct(product._id)}>
                            Edit
                          </Button>
                          <Button variant="outlined" color="error" onClick={() => handleDeleteProduct(product._id)}>
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
                <Typography variant="h6">{newProduct._id ? 'Edit Product' : 'Add New Product'}</Typography>
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
            <Box sx={{ display: 'flex', flexDirection: 'row', padding: 3 }}>
              <Box sx={{ flex: 3, paddingRight: 3 }}>
                <CustomerProductAnalytics /> {/* Added CustomerProductAnalytics */}
              </Box>
            </Box>
          </Box>
        </Box>
      
    
  );
};

export default DashboardApp;