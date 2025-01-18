import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaChartLine } from 'react-icons/fa';
import logo1 from '../images/logo1.png'; // Corrected import path
const Sidebar = () => (
  <div className="sidebar">
    <div className="logo1">
      <img src={logo1} alt="logo1" />
    </div>
    <ul>
      <li><Link to="/"><FaHome /> Dashboard</Link></li>
      <li><Link to="/users"><FaUsers /> Users</Link></li>
      <li><Link to="/reports"><FaChartLine /> Reports</Link></li>
    </ul>
  </div>
);

export default Sidebar;
