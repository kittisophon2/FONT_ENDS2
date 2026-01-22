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
    
    // ✅ แก้ไขตรงนี้: แปลงเป็นตัวพิมพ์ใหญ่ก่อนเช็ค หรือเช็คทั้ง 2 แบบ
    // ใช้ ?. เพื่อกัน Error กรณีไม่มี field role
    const role = decoded.role ? decoded.role.toUpperCase() : "";
    
    const isAdmin = role === "ADMIN" || decoded.email === "admin@gmail.com"; 

    if (!isAdmin) {
      alert("คุณไม่มีสิทธิ์เข้าถึงส่วนนี้!");
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