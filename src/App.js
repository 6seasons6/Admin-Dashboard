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

import PersonalisedDashboard from './pages/PersonalisedDashboard';


import ProductTable from './components/ProductManagement/ProductTable';


import { GoogleOAuthProvider } from '@react-oauth/google';

import ProductForm from './components/ProductManagement/ProductForm';
import ForgotPassword from './components/Auth/ForgotPassword';
//import ResetPassword from './components/Auth/ResetPassword';
import UserForm from './components/UserManagement/UserForm';
import UserTable from './components/UserManagement/UserTable';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  spacing: 8, // Default spacing
});



const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
      <Router>
        <div className="app">
          <Sidebar />
          <div className="main-content">
            <Navbar />
            <div className="content">
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<PersonalisedDashboard />} />
                
                <Route path="/users" element={<UserList />} />

                <Route path="/ProductList" element={<ProductList />} />
                <Route path="/ProductForm" element={<ProductForm/>} />
                <Route path="/ProductTable" element={<ProductTable/>} />


                <Route path="/users/new" element={<UserForm />} /> {/* For adding a new user */}
                <Route path="/users/edit/:userId" element={<UserForm />} /> 
                <Route path="/user-table" element={<UserTable />} />
                
                <Route path="/products" element={<ProductList />} />
                <Route path="/ProductForm" element={<ProductForm />} />

                {/* Analytics Routes */}
                <Route path="/analytics/sales" element={<SalesReport />} />
                <Route path="/analytics/activity" element={<UserActivity />} />
                
                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="./pages/Dashboard.js" element={<Dashboard/>}/>

                <Route path="/forgot-password" element={<ForgotPassword />} />

                




                {/* Legacy Routes (if needed) */}
                <Route path="/users-old" element={<Users />} />
                <Route path="/reports-old" element={<Reports />} />
              </Routes>
            </div>
            
            <Footer />
          </div>
        </div>
      </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

