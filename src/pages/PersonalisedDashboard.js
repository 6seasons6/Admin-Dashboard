import React, { useEffect, useState } from 'react';
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
  const [screenTime, setScreenTime] = useState(0); // Track screen time
  const [startTime, setStartTime] = useState(null); // Track session start time
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);

  
   // Function to simulate dynamic activity feed updates
   const addActivity = (newActivity) => {
    setActivityFeed((prevFeed) => [newActivity, ...prevFeed]);
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

         // Simulating initial activity feed
         const mockActivity = [
          { type: 'Product', message: 'Product A sold 5 units', timestamp: '2025-01-22 10:45 AM' },
          { type: 'User', message: 'New user registered: John Doe', timestamp: '2025-01-22 09:30 AM' },
          { type: 'System', message: 'Low stock alert: Product B', timestamp: '2025-01-22 08:15 AM' },
        ];
        setActivityFeed(mockActivity);
      
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
    
    // Simulating new activity every 10 seconds
    const interval = setInterval(() => {
      const newActivity = {
        type: 'System',
        message: `New system alert at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toLocaleString(),
      };
      addActivity(newActivity);
    }, 10000); // Add a new activity every 10 seconds

    // Clean up the interval on unmount
  //   return () => clearInterval(interval);
  // }, []);

 
    // Cleanup the event listener
    return () => {
      window.onbeforeunload = null;
      clearInterval(interval)
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
     <Box sx={{ display: 'flex', minHeight: '100vh', background: '#bcaaa4 ' }}>
      <Box sx={{ flex: 1, padding: 3, color: '#2D3748', marginRight: '300px', overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom></Typography>
        <Box
          sx={{
            // display: 'flex',
            // flexDirection: 'column',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #A2D5AB, #F8C7B6)',
          }}
        >
         <Box sx={{  minHeight: '100vh', background: 'linear-gradient(135deg, #A2D5AB, #F8C7B6)',
 
 }}>











          
          {/* Main Content */}
      
          <Box sx={{ flex: 1, padding: 2 }}>
          
            {/* Your main content here */}
          
          


           {/* Right Sidebar - Recent Activity Feed (Fixed) */}
    <Box
      sx={{
        position: 'fixed',
        top: '7.5%',
        right: 0,
        width: '300px',
        background: '#fff2df',
        padding: 2,
        boxShadow: '-4px 0px 10px rgba(0,0,0,0.1)',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 1000,
        borderLeft: '2px solid #E2E8F0',
        borderRadius: '12px 12px 12px 12px',

        /* ✅ Custom Scrollbar Styles */
    '&::-webkit-scrollbar': {
      width: '8px', // Scrollbar width
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#A0AEC0', // Scroll thumb color
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#2D3748', // Scroll thumb hover effect
    },
    '&::-webkit-scrollbar-track': {
      background: '#E2E8F0', // Scroll track color
      borderRadius: '4px',
    },
      }}
    >
      <Typography variant="h6" 
        sx={{
          color: '#2D3748',
          fontWeight: 'bold',
          paddingBottom: 1,
          borderBottom: '2px solid #E2E8F0',
        }}>
        Recent Activity Feed
      </Typography>
      {activityFeed.length > 0 ? (
        activityFeed.map((activity, idx) => (
          <Box key={idx} sx={{ padding: 2, borderBottom: idx < activityFeed.length - 1 ? '1px solid #E2E8F0' : 'none', transition: 'background 0.3s',
            '&:hover': { background: '#fbd3cc' },
            borderRadius: '8px',
            marginBottom: 1, }}>
            <Typography variant="body1" sx={{  color: 'black'}}>
              {activity.message}
            </Typography>
            <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
              {activity.timestamp}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ color: '#A0AEC0', textAlign: 'center', marginTop: 2 }}>
          No recent activity.
        </Typography>
      )}
    </Box>
  </Box>
          
          {/* Right Sidebar - Recent Activity Feed
        <Box sx={{ position: 'sticky', top:0, right:0, width: '300px', background: '#FFF', padding: 2, boxShadow: 3, overflowY: 'auto', height: '100vh' }}>
        <Typography variant="h6" gutterBottom color="#2D3748">Recent Activity Feed</Typography>
        {activityFeed.length > 0 ? (
          activityFeed.map((activity, idx) => (
            <Box key={idx} sx={{ padding: 1, borderBottom: idx < activityFeed.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
              <Typography variant="body1" color="#4A5568">{activity.message}</Typography>
              <Typography variant="body2" color="#A0AEC0">{activity.timestamp}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="#A0AEC0">No recent activity.</Typography>
        )}
      </Box>
      </Box> */}

















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
      </Box>
      
     
       





     
  );
};
 
export default DashboardApp;