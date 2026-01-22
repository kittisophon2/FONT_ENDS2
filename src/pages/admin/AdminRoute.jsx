import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AdminRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    
    // ⚠️ ตรงนี้คือเงื่อนไขเช็ค Admin
    // ถ้าใน Database คุณยังไม่มี role ให้แก้เป็นเช็ค email ตัวเองไปก่อนได้ครับ
    // เช่น: const isAdmin = decoded.email === "admin@gmail.com";
    const isAdmin = decoded.role === "ADMIN" || decoded.email === "admin@gmail.com"; 

    if (!isAdmin) {
      // alert("คุณไม่มีสิทธิ์เข้าถึงส่วนนี้!"); // เอาออกก็ได้ถ้ารำคาญ
      return <Navigate to="/" replace />;
    }

    return <Outlet />;

  } catch (error) {
    console.error("Token Error:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;