import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
// เพิ่ม Layers (หรือ List) ในการ import
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Home, Layers } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      
      // เช็คสิทธิ์ (ถ้าต้องการให้ Admin เห็นเท่านั้น)
      if (userData.role !== 'admin' && userData.role !== 'superadmin') {
        alert("คุณไม่มีสิทธิ์เข้าถึงส่วนนี้");
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("ต้องการออกจากระบบหรือไม่?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // รายการเมนู
  const menuItems = [
    { 
      path: "/admin", 
      icon: <LayoutDashboard size={20} />, 
      label: "ภาพรวม", 
      exact: true,
      roles: ['admin', 'superadmin'] 
    },
    { 
      path: "/admin/products", 
      icon: <Package size={20} />, 
      label: "จัดการสินค้า", 
      roles: ['admin', 'superadmin'] 
    },
    // เมนูจัดการหมวดหมู่
    { 
      path: "/admin/categories", 
      icon: <Layers size={20} />, 
      label: "จัดการหมวดหมู่", 
      roles: ['admin', 'superadmin'] 
    },
    { 
      path: "/admin/orders", 
      icon: <ShoppingCart size={20} />, 
      label: "คำสั่งซื้อ", 
      roles: ['admin', 'superadmin'] 
    },
    { 
      path: "/admin/users", 
      icon: <Users size={20} />, 
      label: "จัดการสมาชิก", 
      roles: ['superadmin', 'admin'] // เพิ่ม admin ให้เห็นด้วยชั่วคราวเผื่อเทส
    },
  ];

  if (!user) return null; 

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col fixed h-full z-20 transition-all duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-extrabold text-blue-600 flex flex-col gap-1 tracking-tight">
             <span className="flex items-center gap-2">IT STORE</span>
             <div className="flex items-center gap-2 mt-1">
               <span className="bg-blue-100 text-blue-600 border border-blue-200 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                 {user.role}
               </span>
               <span className="text-xs text-gray-400 font-normal truncate max-w-[100px]">
                 {user.username}
               </span>
             </div>
          </h1>
        </div>
        
        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            // เช็คสิทธิ์การมองเห็นเมนู
            if (item.roles && !item.roles.includes(user.role)) return null;

            const isActive = item.exact 
                ? location.pathname === item.path || location.pathname === item.path + "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-xl mb-2 transition-all">
            <Home size={20} /> กลับหน้าร้าน
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-medium">
            <LogOut size={20} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;