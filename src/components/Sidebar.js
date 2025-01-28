import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaChartLine, FaProductHunt, FaUserCircle } from 'react-icons/fa';

import { SiGoogleanalytics } from 'react-icons/si';
import { IoSettings } from 'react-icons/io5';
const Sidebar = () => (
  <div className="sidebar">
    <div className="logo1 text-center">
    <FaUserCircle />
    </div>
    <nav>
    <ul className='listitems'>
      <li ><Link to="/"><FaHome className='icons'/> <span className='d-none d-sm-inline'> Dashboard</span> </Link></li>
      <li><Link to="/"><FaProductHunt  className='icons'/> <span className='d-none d-sm-inline'> Product Management</span> </Link></li>
      <li><Link to="/"><SiGoogleanalytics className='icons'/> <span className='d-none d-sm-inline'> Analytics</span> </Link></li>

      <li><Link to="/users"><FaUsers className='icons'/> <span className='d-none d-sm-inline'> Users</span> </Link></li>
      <li><Link to="/reports"><FaChartLine className='icons'/> <span className='d-none d-sm-inline'> Reports</span> </Link></li>
      <li><Link to="/"><IoSettings className='icons'/> <span className='d-none d-sm-inline'> Settings</span> </Link></li>

    </ul>
    </nav>
  </div>
);

export default Sidebar;
