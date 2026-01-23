import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:4000", // ⚠️ ตรวจสอบว่า Backend คุณรัน Port 4000 หรือไม่
  headers: {
    "Content-type": "application/json",
  },
});

// ✅ เพิ่มส่วนนี้: Interceptor สำหรับฝัง Token ไปใน Header ทุกครั้ง
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ดึง Token จากเครื่อง
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // ส่งไปแบบ Bearer Token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;