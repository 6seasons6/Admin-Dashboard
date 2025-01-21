import React, { useState } from "react";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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
            <li>
              <Link to="/login">Login</Link>
            </li>
            
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
