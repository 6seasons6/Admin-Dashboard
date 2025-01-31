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
  const [notifications] = useState(0); 
  const navigate = useNavigate();
  const location = useLocation();
  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };
  const handleLogout = () => {
    setIsLoggedIn(false); 
    navigate("/login"); 
  };

  // Track current date and time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleNotificationClick = () => {
    console.log("Notification clicked");
  };

  return (
    <nav className="navbar">
      {location.pathname === "/dashboard" && (
        <div className="dashboard-links">
          <div className="image">
            <img src={image} alt="logo1" />
          </div>

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
              sx={{ fontSize: "15px" }}
            >
              SUPPORTS
            </Button>
            <Button
              component={RouterLink}
              to="/reports"
              variant="text"
              color="primary"
              size="medium"
              sx={{ fontSize: "15px" }}
            >
              REPORTS
            </Button>
            <Button
              component={RouterLink}
              to="/settingpage"
              variant="text"
              color="primary"
              size="medium"
              sx={{ fontSize: "15px" }}
            >
              SETTINGS
            </Button>
            <IconButton
              color="inherit"
              onClick={handleNotificationClick}
              sx={{
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                marginLeft: "10px", 
              }}
            >
              <Badge badgeContent={notifications} color="error">
                <NotificationsIcon sx={{ color: "black" }} />
              </Badge>
            </IconButton>
          </div>

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

      {/* User Icon and Login Icon */}
      <div className="dropdown" style={{ position: "relative" }}>
        {!isLoggedIn ? (
          <IconButton
            onClick={() => navigate("/login")} 
            style={{
              fontSize: "24px", 
              color: "black", 
            }}
          >
            <PersonIcon />
          </IconButton>
        ) : (
          <div>
            <div
              className="icon-container"
              onClick={toggleDropdown} 
              style={{ cursor: "pointer" }}
            >
              <PersonIcon style={{ color: "black" }} />
            </div>
            {dropdownVisible && (
              <ul
                className="dropdown-menu"
                style={{
                  position: "absolute",
                  top: "40px",
                  right: "0",
                  background: "white",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  listStyle: "none",
                  padding: "10px",
                  borderRadius: "5px",
                  zIndex: 10,
                  minWidth: "150px",
                }}
              >
                <li style={{ margin: "5px 0" }}>
                  <Button
                    onClick={handleLogout} 
                    variant="text"
                    style={{ color: "red" }}
                    fullWidth
                  >
                    Logout
                  </Button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;