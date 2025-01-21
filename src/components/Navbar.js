import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Simulate logout
    navigate("/"); // Redirect to the homepage
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Admin Panel</h1>
      <div className="dropdown">
        <div className="icon-container" onClick={toggleDropdown}>
          <PersonIcon />
        </div>
        {dropdownVisible && (
          <ul className="dropdown-menu">
            {!isLoggedIn ? (
              <li>
                <Link to="/login" onClick={() => setIsLoggedIn(true)}>
                  Login
                </Link>
              </li>
            ) : (
              <li>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
