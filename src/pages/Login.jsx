import React, { useState } from "react";
import { Lock, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import UserService from "../Services/User.service";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserService.login({ email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      alert("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-green-100">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-[400px]">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <NavLink to="/">
            <img
              src="/pic/gogo.png"
              alt="BookTrees Logo"
              className="h-32 mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-700">BookTrees</h1>
          </NavLink>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-600 mb-2">อีเมล</label>
            <div className="flex items-center border rounded-lg px-4 py-2">
              <User className="text-gray-400" size={20} />
              <input
                type="email"
                placeholder="กรอกอีเมลของคุณ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-3 outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-gray-600 mb-2">รหัสผ่าน</label>
            <div className="flex items-center border rounded-lg px-4 py-2">
              <Lock className="text-gray-400" size={20} />
              <input
                type="password"
                placeholder="กรอกรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#304896] text-white py-3 rounded-full text-lg font-semibold hover:bg-blue-800 transition duration-200"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ยังไม่มีบัญชี?{" "}
            <NavLink
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              สร้างบัญชีใหม่
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;