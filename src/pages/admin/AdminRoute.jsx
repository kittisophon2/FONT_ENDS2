import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user"); // ดึงข้อมูล User ที่เก็บไว้

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    let role = "";

    // 🔍 วิธีที่ 1: หา Role ใน Token (ถ้า Backend ใส่มา)
    if (decoded.role) {
      role = decoded.role;
    } 
    // 🔍 วิธีที่ 2: ถ้าใน Token ไม่มี ให้หาจากข้อมูล User ในเครื่อง
    else if (userStr) {
      const user = JSON.parse(userStr);
      role = user.role || "";
    }

    // Debug: ดูค่าที่อ่านได้ใน Console (กด F12)
    console.log("Checking Admin Access...");
    console.log("- Token Role:", decoded.role);
    console.log("- Storage Role:", role);

    // ✅ ตรวจสอบ: แปลงเป็นตัวใหญ่ทั้งหมด แล้วเทียบกับ "ADMIN" หรือ "SUPERADMIN"
    const upperRole = role ? role.toUpperCase() : "";
    const isAdmin = upperRole === "ADMIN" || upperRole === "SUPERADMIN";

    if (!isAdmin) {
      alert(`คุณไม่มีสิทธิ์เข้าถึงส่วนนี้! (Role ของคุณคือ: "${role}")`);
      return <Navigate to="/" replace />;
    }

    // ถ้าผ่านเงื่อนไข ให้เข้าใช้งานได้
    return <Outlet />;

  } catch (error) {
    console.error("Auth Error:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;