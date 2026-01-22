import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AdminRoute = () => {
  const token = localStorage.getItem("token");

  // 1. ถ้าไม่มี Token -> ไป Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    
    // 2. ตรวจสอบ Role (ต้องแก้เงื่อนไขนี้ให้ตรงกับ Database คุณ)
    // สมมติว่าใน Token มี field "role" หรือ "isAdmin"
    // ถ้า Database ยังไม่มี role ให้ลองเช็คจาก email เฉพาะกิจไปก่อน เช่น admin@gmail.com
    const isAdmin = decoded.role === "ADMIN" || decoded.email === "admin@gmail.com"; 

    if (!isAdmin) {
      alert("คุณไม่มีสิทธิ์เข้าถึงส่วนนี้!");
      return <Navigate to="/" replace />;
    }

    // 3. ถ้าเป็น Admin จริง -> อนุญาตให้เข้า (Outlet คือหน้าลูกๆ)
    return <Outlet />;

  } catch (error) {
    console.error("Token Error:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;