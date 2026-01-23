import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // ✅ ประกาศครั้งเดียวพอ

// Pages
import Home from './pages/Home'
import Register from './pages/Register' // ✅ ใช้ชื่อเดียว (Register)
import Login from './pages/Login'
import Products from './pages/Products'
import Content from './pages/Content'
import Cart from "./pages/Cart";

// Admin Components
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductManage from "./pages/admin/ProductManage";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Public Routes === */}
        <Route path="/" element={<Home />} />
        <Route path="/registers" element={<Register />} /> {/* ใช้ Component ตัวเดียวกัน */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/content/:id" element={<Content />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* หน้าสินค้า */}
        <Route path="/bookcategories/category/:category_id" element={<Products />} />
        <Route path="/products" element={<Products />} />

        {/* === Admin Routes === */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} /> {/* /admin */}
            <Route path="dashboard" element={<Dashboard />} /> {/* /admin/dashboard */}
            <Route path="products" element={<ProductManage />} />
            <Route path="orders" element={<div>หน้าจัดการคำสั่งซื้อ (สร้างเพิ่มได้)</div>} />
            <Route path="users" element={<div>หน้าจัดการผู้ใช้ (สร้างเพิ่มได้)</div>} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App