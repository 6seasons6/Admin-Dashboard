import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Reports from './pages/Reports';
import './App.css'; // Make sure the path is correct
import { AuthProvider } from './contexts/AuthContext';
import UserList from './components/UserManagement/UserList';
import ProductList from './components/ProductManagement/ProductList';
import SalesReport from './components/Analytics/SalesReport';
import UserActivity from './components/Analytics/UserActivity';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <div className="main-content">
            <Navbar />
            <div className="content">
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/products" element={<ProductList />} />

                {/* Analytics Routes */}
                <Route path="/analytics/sales" element={<SalesReport />} />
                <Route path="/analytics/activity" element={<UserActivity />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                

                {/* Legacy Routes (if needed) */}
                <Route path="/users-old" element={<Users />} />
                <Route path="/reports-old" element={<Reports />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
