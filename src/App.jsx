import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import Content from './pages/Content';
import Cart from "./pages/Cart";

// Admin Components
// ⚠️ ตรวจสอบ Path นี้ให้ดี ถ้า AdminRoute อยู่ใน pages/admin ก็ใช้ ./pages/admin/AdminRoute
import AdminRoute from "./components/AdminRoute"; 
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductManage from "./pages/admin/ProductManage";
import UserManage from "./pages/admin/UserManage";
import CategoryManage from "./pages/admin/CategoryManage"; 

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registers" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/content/:id" element={<Content />} />
        <Route path="/products" element={<Products />} />
        <Route path="/bookcategories/category/:category_id" element={<Products />} />
        <Route path="/cart" element={<Cart />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductManage />} />
            <Route path="categories" element={<CategoryManage />} />
            <Route path="users" element={<UserManage />} />
            
            <Route path="orders" element={
                <div className="flex items-center justify-center h-64 text-gray-400">
                    Coming Soon
                </div>
            } />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;