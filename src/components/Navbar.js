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

 

const Navbar = () => {
  const { authData, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // State for storing search results
  const [notifications] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user data when authData changes or on route change
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

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle menu open/close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);


  // Handle menu open/close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    setUserData(null);
    handleMenuClose();
    navigate("/login");
  };

  // Handle search functionality
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        // Use searchQuery (not search) in the Axios call
        const response = await axios.get(`http://localhost:3000/api/search?q=${searchQuery}`);
        setSearchResults(response.data); // Store the search results in state
      } catch (error) {
        console.error("Error searching products:", error);
      }
    } else {
      setSearchResults([]); // Clear search results if query is empty
    }

  };
 
  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    setUserData(null);
    handleMenuClose();
    navigate("/login");
  };
 
  // Handle search functionality
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        // Use searchQuery (not search) in the Axios call
        const response = await axios.get(`http://localhost:3000/api/search?q=${searchQuery}`);
        setSearchResults(response.data); // Store the search results in state
      } catch (error) {
        console.error("Error searching products:", error);
      }
    } else {
      setSearchResults([]); // Clear search results if query is empty
    }
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update query as the user types
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(); // Trigger search on "Enter"
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  border: "none",
                  width: "10rem",
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "none" },
                },
              }}
            />
          </div>
 
          {/* Display search results if any */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <Typography variant="h6">Search Results:</Typography>
              <List>
                {searchResults.map((result, index) => (
                  <ListItem key={index} style={{ color: "yellow" }}>
                    {result.name} {/* Display product name */}
                  </ListItem>
                ))}
              </List>
            </div>
          )}
 
 <IconButton
  color="inherit"
  disableRipple
  sx={{
    marginLeft: "10px",
    "&:hover": { boxShadow: "none" },
    "&:focus": { boxShadow: "none" },
  }}
>
  <Badge
    badgeContent={notifications}
    color="error"
    sx={{
      // This targets the inner badge element
      "& .MuiBadge-badge": {
        boxShadow: "none",
      },
    }}
  >
    <NotificationsIcon
      sx={{ color: "black", marginLeft: "12rem" }}
    />
  </Badge>
</IconButton>


          {/* Display search results if any */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <Typography variant="h6">Search Results:</Typography>
              <List>
                {searchResults.map((result, index) => (
                  <ListItem key={index} style={{ color: "yellow" }}>
                    {result.name} {/* Display product name */}
                  </ListItem>
                ))}
              </List>
            </div>
          )}

          <IconButton color="inherit" sx={{ marginLeft: "10px" }}>
            <Badge badgeContent={notifications} color="error">
              <NotificationsIcon
                sx={{ color: "black", boxShadow: "none", marginLeft: "17rem" }}
              />
            </Badge>
          </IconButton>

        </div>
      )}
      {location.pathname !== "/dashboard" && (
        <Typography variant="h6" className="navbar-title">
          Admin Panel
        </Typography>
      )}

      {/* User Dropdown */}
      <div
        className="user-icon"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "none",
          marginRight: "3rem",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          sx={{ cursor: "pointer" }}
          onClick={handleMenuOpen}
        >
          <FaUserCircle style={{ color: "black", marginRight: "8px" }} size={32} />
          {userData && (
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "green" }}>
              {userData.name}
            </Typography>
          )}
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {!userData ? (
            <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>
          ) : (
            [
              <MenuItem key="settings" onClick={() => navigate("/settingpage")}>
                Settings
              </MenuItem>,
              <MenuItem key="editProfile" onClick={() => navigate("/Profile")}>
                Edit Profile
              </MenuItem>,
              <MenuItem key="logout" onClick={handleLogout}>
                Logout
              </MenuItem>,
            ]
          )}
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;


export default Navbar;
