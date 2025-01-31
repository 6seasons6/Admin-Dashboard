import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Graphs from "./pages/Reports";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import UserList from "./components/UserManagement/UserList";
import ProductList from "./components/ProductManagement/ProductList";
import SalesReport from "./components/Analytics/SalesReport";
import UserActivity from "./components/Analytics/UserActivity";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PersonalisedDashboard from "./pages/PersonalisedDashboard";
import ProductTable from "./components/ProductManagement/ProductTable";
import ProductForm from "./components/ProductManagement/ProductForm";
import ForgotPassword from "./components/Auth/ForgotPassword";
import UserForm from "./components/UserManagement/UserForm";
import UserTable from "./components/UserManagement/UserTable";
import SettingPage from "./pages/Settingpage";
import SupportPage from "./pages/Supportpage";
import { createTheme } from "@mui/material";
import SalesAnalytics from "./components/Analytics/SalesAnalytics";
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

 
const Layout = ({ children }) => {
  const location = useLocation();
 
  // Hide Sidebar only when there is no path (i.e., homepage `/`)
  const showSidebar = location.pathname !== "/";
 
  return (
<div className="app" style={{ display: "flex" }}>
      {showSidebar && <Sidebar />} {/* Sidebar appears on all pages except `/` */}
<div className="main-content" style={{ flex: 1 }}>
<Navbar />
<div className="content">{children}</div>
<Footer />
</div>
</div>
  );
};
 
const App = () => {
  return (
<AuthProvider>
<Router>
<Layout>
<Routes>
            {/* Main Routes */}
<Route path="/" element={<Dashboard />} />
<Route path="/dashboard" element={<PersonalisedDashboard />} />
<Route path="/users" element={<UserList />} />
<Route path="/products" element={<ProductList />} />
<Route path="/ProductList" element={<ProductList />} />
<Route path="/ProductForm" element={<ProductForm />} />
<Route path="/ProductTable" element={<ProductTable />} />
<Route path="/users/new" element={<UserForm />} />
<Route path="/users/edit/:userId" element={<UserForm />} />
<Route path="/user-table" element={<UserTable />} />
 
            {/* Analytics Routes */}
<Route path="/analytics/sales" element={<SalesReport />} />
<Route path="/analytics/activity" element={<UserActivity />} />
<Route path="/analytics" element={<SalesAnalytics />} />
 
            {/* Authentication Routes */}
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
 
            {/* Other Pages */}
<Route path="/reports" element={<Graphs />} />
<Route path="/settingpage" element={<SettingPage />} />
<Route path="/supportpage" element={<SupportPage />} />

</Routes>
</Layout>
</Router>
</AuthProvider>
  );
};
 
export default App;