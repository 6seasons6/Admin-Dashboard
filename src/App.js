import React from 'react';
import { BrowserRouter as Router, Routes, Route,useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Graphs from './pages/Reports';
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
import ProductForm from './components/ProductManagement/ProductForm';
import ForgotPassword from './components/Auth/ForgotPassword';
//import ResetPassword from './components/Auth/ResetPassword';
import UserForm from './components/UserManagement/UserForm';
import UserTable from './components/UserManagement/UserTable';
import { createTheme } from '@mui/material/styles';
import SettignPage from './pages/Settingpage';
import SupportPage from './pages/Supportpage';
 
import TodoPlanner from './pages/TodoPlanner';
import ProtectedRoute from "./components/ProtectedRoute";
import SalesAnalytics from "./components/Analytics/SalesAnalytics";
import Profile from './pages/Profile';
import { useState } from "react";
import DashboardApp from './pages/PersonalisedDashboard';
 import OrdersTable from './pages/OrdersTable';
 
const Layout = ({ children }) => {
  const location = useLocation();
 
  // Hide Sidebar only when there is no path (i.e., homepage `/`)
 
  const hiddenPaths=["/","/login","/register","/forgot-password"];
 
  const [searchQuery, setSearchQuery] = useState('');
 
  return (
<div className="app" style={{ display: "flex" }}>
      {!hiddenPaths.includes(location.pathname) && <Sidebar />} {/* Sidebar appears on all pages except `/` */}
<div className="main-content" style={{ flex: 1 }}>
 
     
     
   
<div className="content">{children}</div>
<Footer />
</div>
</div>
  );
};
 
 
const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
   
    <AuthProvider>
      <Router>
      
      <Layout>
        <Navbar setSearchQuery={setSearchQuery} />
         <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<PersonalisedDashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>} />
               
                <Route path="/users" element={<UserList />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/OrdersTable" element={<OrdersTable />} />

                <Route path="/ProductList" element={<ProductList />} />
                <Route path="/ProductForm" element={<ProductForm />} />
                <Route path="/ProductTable" element={<ProductTable />} />
                <Route path="/users/new" element={<UserForm />} />
                <Route path="/users/edit/:userId" element={<UserForm />} />
                <Route path="/user-table" element={<UserTable />} />
                <Route path="/todoplanner" element={
                        <ProtectedRoute>
                            <TodoPlanner />
                        </ProtectedRoute>
                    } />
 
 
                <Route path="/dashboard" element={<PersonalisedDashboard />} />
 
                <Route path="/ProductList" element={<ProductList />} />
                <Route path="/ProductForm" element={<ProductForm />} />
                <Route path="/ProductTable" element={<ProductTable />} />
                <Route path="/users/new" element={<UserForm />} /> {/* For adding a new user */}
                <Route path="/users/edit/:userId" element={<UserForm />} />
                <Route path="/user-table" element={<UserTable />} />
 
                <Route path="/products" element={<ProductList />} />
                <Route path="/ProductForm" element={<ProductForm />} />
               
                {/* Analytics Routes */}
                <Route path="/analytics/sales" element={<SalesReport />} />
                <Route path="/analytics/activity" element={<UserActivity />} />
                <Route path="/analytics" element={<SalesAnalytics />} />
 
                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

 
 
                <Route path="./pages/Dashboard.js" element={<Dashboard/>}/>
 
 
                <Route path="/forgot-password" element={<ForgotPassword />} />
                  {/* Legacy Routes (if needed) */}
                <Route path="/users-old" element={<Users />} />
                <Route path="/reports" element={<Graphs />} />
                <Route path="/settingpage" element={<SettignPage />} />
                <Route path="/supportpage" element={<SupportPage />} />
                <Route path="/Profile" element= {<Profile />} />
 
              </Routes>
              </Layout>
      </Router>
     </AuthProvider>
   
  );
};
 
 
export default App;