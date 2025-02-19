import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Typography,
  Badge,
  Box,
  Menu,
  MenuItem,
  List,
  ListItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ setSearchQuery }) => {
  const { authData, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authData?.token) {
        setUserData(null);
        return;
      }
      try {
        const response = await axios.get("/api/user", {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      }
    };
    fetchUserData();
  }, [authData, location.pathname]);

  // Fetch Products to Identify Low Stock (Runs Once on Mount)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/products", {
          headers: { Authorization: `Bearer ${authData?.token}` },
        });

        if (response.data && Array.isArray(response.data)) {
          const lowStockItems = response.data.filter((product) => product.stock <= 5);
          setNotifications(lowStockItems.length);
          setLowStockProducts(lowStockItems);
          console.log("Initial Low stock products:", lowStockItems);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    fetchProducts();
  }, []); // Runs only on component mount

  // WebSocket Connection (Only Updates Notification Count)
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "LOW_STOCK_ALERT") {
        setNotifications(data.products.length); // Updates only the notification count
        console.log("Low stock count updated:", data.products.length);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    setUserData(null);
    handleMenuClose();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {location.pathname === "/dashboard" && (
        <div className="dashboard-links">
          <div className="navbar-links">
            <Button component={RouterLink} to="/supportpage" variant="text">
              SUPPORTS
            </Button>
            <Button component={RouterLink} to="/reports" variant="text">
              REPORTS
            </Button>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "black" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {/* Notifications Icon */}
          <IconButton onClick={handleNotificationClick} disableRipple>
            <Badge badgeContent={notifications} color="error">
              <NotificationsIcon sx={{ color: "black",marginLeft:"5.5rem" }} />
            </Badge>
          </IconButton>

          {/* Notifications Dropdown Menu */}
          <Menu anchorEl={notificationAnchor} open={Boolean(notificationAnchor)} onClose={handleNotificationClose}>
            {lowStockProducts.length > 0 ? (
              <List>
                {lowStockProducts.map((product, index) => (
                  <ListItem key={index}>
                    <Typography variant="body2" color="error">
                      ⚠ {product.name} - Only {product.stock} left!
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <MenuItem onClick={handleNotificationClose}>No alerts</MenuItem>
            )}
          </Menu>
        </div>
      )}

      {location.pathname !== "/dashboard" && (
        <Typography variant="h6" className="navbar-title">
          Admin Panel
        </Typography>
      )}

      {/* User Profile Menu */}
      <div
        className="user-icon"
        style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "3rem" }}
      >
        <Box display="flex" alignItems="center" sx={{ cursor: "pointer" }} onClick={handleMenuOpen}>
          <FaUserCircle style={{ color: "black", marginRight: "8px", boxShadow: "none" }} size={32} />
          {userData && (
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "green" }}>
              {userData.name}
            </Typography>
          )}
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {!userData ? (
            <MenuItem onClick={() => navigate("/login")} sx={{ color: "blue" }}>
              Login
            </MenuItem>
          ) : (
            <>
              <MenuItem onClick={() => navigate("/settingpage")} sx={{ color: "blue", "&:hover": { backgroundColor: "#cfcfe5" } }}>
                Settings
              </MenuItem>
              <MenuItem onClick={() => navigate("/Profile")} sx={{ color: "blue", "&:hover": { backgroundColor: "#cfcfe5" } }}>
                Edit Profile
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "blue", "&:hover": { backgroundColor: "#cfcfe5" } }}>
                Logout
              </MenuItem>
            </>
          )}
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
