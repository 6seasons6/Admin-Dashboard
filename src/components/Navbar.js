import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { TextField, InputAdornment, Button, IconButton, Typography, Badge } from "@mui/material";
import image from "../images/image.png";

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentDateTime, setCurrentDateTime] = useState(""); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [notifications] = useState(); 
  const navigate = useNavigate();
  const location = useLocation(); 

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); 
    navigate("/"); 
  };

  useEffect(() => {
 const interval = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString()); 
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    console.log("Search Query:", event.target.value); 
  };

  const handleNotificationClick = () => {
    console.log("Notification button clicked");
  };

  return (
    <nav className="navbar">
  {location.pathname === "/dashboard" && (
    <div className="dashboard-links">
      <div className="image">
        <img src={image} alt="logo1"  />
      </div>

      {/* Container for search bar and other elements */}
      <div className="navbar-links">
        {/* Search Bar */}
        <div className="search-bar">
        <TextField
  variant="outlined" 
  placeholder="Search..."
  size="small"
  value={searchQuery}
  onChange={handleSearchChange}
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
      "&:hover fieldset": {
        border: "none", 
      },
      "&.Mui-focused fieldset": {
        border: "none", 
      },
    },

    "& .MuiFilledInput-root": {
      border: "none", 
      "&:hover": {
        border: "none", 
      },
      "&.Mui-focused": {
        border: "none", 
      },
    },
  }}
/>
   </div>

        {/* Links Section */}
        <Button
          component={RouterLink}
          to="/supportpage"
          variant="text"
          color="primary"
          size="medium"
          sx={{
            fontSize: '15px', 
          }}
        >
          SUPPORTS
        </Button>
        <Button
          component={RouterLink}
          to="/reports"
          variant="text"
          color="primary"
          size="medium"
          sx={{
            fontSize: '15px', 
          }}
        >
          REPORTS
        </Button>
        <Button
          component={RouterLink}
          to="/settingpage"
          variant="text"
          color="primary"
          size="medium"
          sx={{
            fontSize: '15px', 
          }}
        >
          SETTINGS
        </Button>

        {/* Notification Icon */}
        <IconButton
          color="inherit"
          onClick={handleNotificationClick}
          sx={{
            backgroundColor: "transparent",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
          }}
        >
          <Badge badgeContent={notifications} color="error">
            <NotificationsIcon sx={{ color: "black" }} />
          </Badge>
        </IconButton>
      </div>

      {/* Current Date and Time */}
      <div className="current-datetime" style={{ marginLeft: "auto" }}>
        <Typography variant="body2" color="text.secondary">
          {currentDateTime}
        </Typography>
      </div>
    </div>
  )}

  {location.pathname !== "/dashboard" && (
    <Typography variant="h6" component="div" className="navbar-title">
      Admin Panel
    </Typography>
  )}

  {/* Profile Dropdown */}
  <div className="dropdown">
    <div className="icon-container" onClick={toggleDropdown}>
      <PersonIcon style={{ color: "black" }} />
    </div>
    {dropdownVisible && (
      <ul className="dropdown-menu">
        {!isLoggedIn ? (
          <li>
            <Button
              component={RouterLink}
              to="/login"
              onClick={() => setIsLoggedIn(true)}
              variant="text"
            >
              Login
            </Button>
          </li>
        ) : (
          <li>
            <Button onClick={handleLogout} className="logout-button" variant="text" style={{ color: "red" }}>
              Logout
            </Button>
          </li>
        )}
      </ul>
    )}
  </div>
</nav>

  );
};

export default Navbar;
