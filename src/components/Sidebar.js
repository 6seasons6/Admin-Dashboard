import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaChartLine } from 'react-icons/fa';

const Sidebar = () => (
  <div className="sidebar">
    <h2>Admin Dashboard</h2>
    <ul>
      <li><Link to="/"><FaHome /> Dashboard</Link></li>
      <li><Link to="/users"><FaUsers /> Users</Link></li>
      <li><Link to="/reports"><FaChartLine /> Reports</Link></li>
    </ul>
  </div>
);

export default Sidebar;
