import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Home } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: "ภาพรวม" },
    { path: "/admin/products", icon: <Package size={20} />, label: "จัดการสินค้า" },
    { path: "/admin/orders", icon: <ShoppingCart size={20} />, label: "คำสั่งซื้อ" },
    { path: "/admin/users", icon: <Users size={20} />, label: "ผู้ใช้งาน" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col fixed h-full z-10">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
             Admin Panel
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 font-bold shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl mb-2">
            <Home size={20} /> กลับหน้าร้าน
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;