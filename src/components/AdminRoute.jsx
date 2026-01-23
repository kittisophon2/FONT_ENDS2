import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const user = userStr ? JSON.parse(userStr) : {};

    // ดึง role จาก Token หรือ LocalStorage
    const role = decoded.role || user.role || "";

    console.log("Checking Admin Access. Found role:", role);

    // ✅ เงื่อนไขที่ถูกต้อง: ยอมรับทั้ง ADMIN และ SUPERADMIN
    const upperRole = role.toUpperCase();
    const isAdmin = upperRole === "ADMIN" || upperRole === "SUPERADMIN";

    if (!isAdmin) {
      alert(`คุณไม่มีสิทธิ์เข้าถึงส่วนนี้! (สิทธิ์ของคุณคือ: "${role}")`);
      return <Navigate to="/" replace />;
    }

    return <Outlet />;

  } catch (error) {
    console.error("Auth Error:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;