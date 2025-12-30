import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ใช้ useNavigate
import { User, Lock, Mail, Image as ImageIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import UserService from "../Services/User.service";

const Register = () => {
  const navigate = useNavigate(); // ✅ ใช้ hook สำหรับเปลี่ยนหน้า
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    picture: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      setFormData({ ...formData, picture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("profilePicture", formData.picture);

    try {
      await UserService.postUser(form);
      setMessage("🎉 สมัครสมาชิกสำเร็จ! กำลังไปยังหน้าเข้าสู่ระบบ...");
      
      // ✅ Redirect ไปที่หน้า /login หลังจากสมัครสมาชิกสำเร็จ (รอ 2 วินาที)
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(`❌ เกิดข้อผิดพลาด: ${error.response.data.error}`);
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

        {/* Register Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-600 mb-2">ชื่อผู้ใช้งาน</label>
            <div className="flex items-center border rounded-lg px-4 py-2">
              <User className="text-gray-400" size={20} />
              <input
                type="text"
                name="username"
                placeholder="ชื่อผู้ใช้งาน"
                className="w-full pl-3 outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-gray-600 mb-2">อีเมล</label>
            <div className="flex items-center border rounded-lg px-4 py-2">
              <Mail className="text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                className="w-full pl-3 outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-gray-600 mb-2">รหัสผ่าน</label>
            <div className="flex items-center border rounded-lg px-4 py-2">
              <Lock className="text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                placeholder="รหัสผ่าน"
                className="w-full pl-3 outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-gray-600 mb-2">อัปโหลดรูปภาพ</label>
            <div className="flex items-center border rounded-lg px-4 py-2">
              <ImageIcon className="text-gray-400" size={20} />
              <input
                type="file"
                name="picture"
                accept="image/*"
                className="w-full pl-3 outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#304896] text-white py-3 rounded-full text-lg font-semibold hover:bg-blue-800 transition duration-200"
          >
            สมัครสมาชิก
          </button>

          {message && (
            <p className="mt-4 text-center text-lg font-medium text-green-600">
              {message}
            </p>
          )}
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            มีบัญชีแล้ว?{" "}
            <NavLink
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              เข้าสู่ระบบ
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
