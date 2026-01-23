import React, { useEffect, useState } from "react";
import UserService from "../../Services/User.service";
import { Trash2, Edit, Plus, X, User, Shield, ShieldCheck, Search, Mail, Loader2 } from "lucide-react";

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserData, setCurrentUserData] = useState(null); // ข้อมูลคน Login ปัจจุบัน

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "", // ใช้เฉพาะตอนเพิ่มใหม่
    role: "user",
    picture: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchUsers();
    checkCurrentUser();
  }, []);

  const checkCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUserData(JSON.parse(userStr));
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, picture: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // เปลี่ยน Role ทันทีเมื่อกดเลือกใน Dropdown (Optional)
  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`ยืนยันการเปลี่ยนสิทธิ์เป็น ${newRole}?`)) {
        try {
            await UserService.updateRole(userId, newRole);
            setUsers(users.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
            alert("เปลี่ยนสิทธิ์เรียบร้อย");
        } catch (error) {
            console.error("Error updating role:", error);
            alert("เปลี่ยนสิทธิ์ไม่สำเร็จ");
        }
    }
  };

  // --- Modal Logic ---

  const openModal = (user = null) => {
    if (user) {
      setIsEditing(true);
      setCurrentUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        password: "", // ไม่แสดงรหัสเดิม
        role: user.role,
        picture: null,
      });
      setImagePreview(
        user.pictureUrl || 
        (user.picture ? `http://localhost:4000/userpictures/${user.picture}` : null)
      );
    } else {
      setIsEditing(false);
      setCurrentUser(null);
      setFormData({ username: "", email: "", password: "", role: "user", picture: null });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // กรณีแก้ไข (Update)
        const data = new FormData();
        data.append("username", formData.username);
        // data.append("email", formData.email); // ปกติอีเมลไม่ค่อยให้แก้ ถ้าจะแก้ก็เปิดได้
        if (formData.picture) {
          data.append("picture", formData.picture);
        }

        await UserService.updateUser(currentUser.user_id, data);
        
        // ถ้ามีการเปลี่ยน Role ในฟอร์มด้วย
        if (currentUser.role !== formData.role) {
             await UserService.updateRole(currentUser.user_id, formData.role);
        }

        alert("แก้ไขข้อมูลสมาชิกเรียบร้อย!");
      } else {
        // กรณีเพิ่มใหม่ (Register)
        const registerData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            // เพิ่ม Role เข้าไปในการสมัครสมาชิกใหม่ด้วย (ถ้า Backend รองรับ)
            role: formData.role 
        };
        await UserService.register(registerData);
        alert("เพิ่มสมาชิกเรียบร้อย!");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Save Error:", error);
      alert("เกิดข้อผิดพลาด: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (currentUserData && currentUserData.user_id === id) {
        alert("ไม่สามารถลบบัญชีตัวเองได้!");
        return;
    }

    if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบสมาชิกคนนี้? ข้อมูลทั้งหมดจะหายไป!")) {
      try {
        await UserService.deleteUser(id);
        setUsers(users.filter((u) => u.user_id !== id));
        alert("ลบสมาชิกเรียบร้อย");
      } catch (error) {
        console.error("Delete Error:", error);
        alert("ลบไม่สำเร็จ");
      }
    }
  };

  // Filter Users
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             <User className="text-blue-600" /> จัดการสมาชิก
           </h2>
           <p className="text-gray-500 text-sm mt-1">จัดการข้อมูลผู้ใช้งานและสิทธิ์การเข้าถึง</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
             <input 
               type="text" 
               placeholder="ค้นหาชื่อ หรือ อีเมล..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
             />
             <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition shadow-sm whitespace-nowrap"
          >
            <Plus size={20} /> เพิ่มสมาชิก
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="py-4 px-6">ผู้ใช้งาน</th>
              <th className="py-4 px-6">อีเมล</th>
              <th className="py-4 px-6">สิทธิ์ (Role)</th>
              <th className="py-4 px-6 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-400">ไม่พบข้อมูลสมาชิก</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-blue-50/50 transition duration-150">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                        {user.picture || user.pictureUrl ? (
                          <img 
                            src={user.pictureUrl || `http://localhost:4000/userpictures/${user.picture}`} 
                            alt={user.username} 
                            className="w-full h-full object-cover"
                            onError={(e) => {e.target.src = "https://placehold.co/100?text=USER"}} 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={20} /></div>
                        )}
                      </div>
                      <span className="font-bold text-gray-700">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-2 text-gray-500">
                       <Mail size={14} /> {user.email}
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer transition shadow-sm
                        ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 
                          user.role === 'superadmin' ? 'bg-red-100 text-red-700' : 
                          'bg-green-100 text-green-700'}`}
                    >
                      {/* ✅ แก้ไข: เพิ่มครบ 3 role */}
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openModal(user)}
                        className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition shadow-sm"
                        title="แก้ไขข้อมูล"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.user_id)}
                        disabled={currentUserData?.user_id === user.user_id}
                        className={`p-2 rounded-lg border transition shadow-sm
                           ${currentUserData?.user_id === user.user_id 
                             ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed' 
                             : 'bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200'}`}
                        title="ลบสมาชิก"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            
            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {isEditing ? <Edit size={20} className="text-yellow-500" /> : <Plus size={20} className="text-blue-500" />}
                {isEditing ? "แก้ไขข้อมูลสมาชิก" : "เพิ่มสมาชิกใหม่"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition rounded-full p-1 hover:bg-red-50">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full border-4 border-gray-100 shadow-inner overflow-hidden relative group cursor-pointer bg-gray-50">
                   {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={40} /></div>
                   )}
                   <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-200 font-medium text-xs">
                     เปลี่ยนรูป
                     <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                   </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้งาน</label>
                <input 
                  type="text" name="username" required
                  value={formData.username} onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                <input 
                  type="email" name="email" required disabled={isEditing}
                  value={formData.email} onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none transition ${isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'}`}
                  placeholder="example@mail.com"
                />
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
                  <input 
                    type="password" name="password" required
                    value={formData.password} onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="Password"
                  />
                </div>
              )}

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">สิทธิ์การใช้งาน (Role)</label>
                 <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                 >
                    {/* ✅ แก้ไข: เพิ่มครบ 3 role */}
                    <option value="user">User (ผู้ใช้ทั่วไป)</option>
                    <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                    <option value="superadmin">Super Admin (เจ้าของระบบ)</option>
                 </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
                >
                  {isEditing ? "บันทึกแก้ไข" : "ยืนยันเพิ่ม"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManage;