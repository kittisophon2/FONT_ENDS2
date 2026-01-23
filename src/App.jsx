import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// --- Pages ---
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Products from './pages/Products'
import Content from './pages/Content'
import Cart from "./pages/Cart";

// --- Admin Components & Pages ---
import AdminRoute from "./components/AdminRoute"; // ตรวจสอบว่าไฟล์นี้อยู่ที่ path นี้จริง
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductManage from "./pages/admin/ProductManage";
import UserManage from "./pages/admin/UserManage";
import CategoryManage from "./pages/admin/CategoryManage"; // ✅ เพิ่ม Import นี้

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Public Routes (ใครก็เข้าได้) === */}
        <Route path="/" element={<Home />} />
        <Route path="/registers" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/content/:id" element={<Content />} />
        <Route path="/cart" element={<Cart />} />

        {/* หน้าสินค้า */}
        <Route path="/bookcategories/category/:category_id" element={<Products />} />
        <Route path="/products" element={<Products />} />

        {/* === Admin Routes (ต้อง Login + เป็น Admin) === */}
        {/* โครงสร้างที่ถูกต้อง: AdminRoute ครอบ AdminLayout ทีเดียวพอ */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
            {/* Child Routes จะไปโผล่ใน <Outlet /> ของ AdminLayout */}
            <Route index element={<Dashboard />} /> 
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route path="products" element={<ProductManage />} />
            <Route path="categories" element={<CategoryManage />} /> {/* ✅ เมนูจัดการหมวดหมู่ */}
            <Route path="users" element={<UserManage />} /> {/* ✅ เมนูจัดการสมาชิก */}
            
            <Route path="orders" element={<div className="p-10 text-center text-gray-500">ระบบจัดการคำสั่งซื้อ (Coming Soon)</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App