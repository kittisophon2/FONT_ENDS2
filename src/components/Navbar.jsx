import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, User, Grid, ShoppingCart, Cpu, LogOut, ChevronDown } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import ProductService from "../Services/Product.service";
import UserService from "../Services/User.service";
import CategoryService from "../Services/Category.service";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ 1. ดึงข้อมูลสินค้าทั้งหมดสำหรับ Search
  useEffect(() => {
    // ใช้ getAllProducts ตามที่แก้ใน Service ล่าสุด
    const fetchProds = async () => {
      try {
        const response = await ProductService.getAllProducts();
        if (response.data) setProducts(response.data);
      } catch (e) {
        console.error("Error fetching products:", e);
      }
    };
    fetchProds();
  }, []);

  // ✅ 2. ดึงข้อมูลหมวดหมู่จาก Backend
  useEffect(() => {
    CategoryService.getCategories()
      .then((response) => {
        // ตรวจสอบว่ามี data หรือไม่
        if (response.data) {
          setCategories(response.data);
        }
      })
      .catch((e) => {
        console.error("Error fetching categories:", e);
      });
  }, []);

  // ✅ 3. Logic การค้นหา
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      return;
    }
    const results = products.filter((product) =>
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  // ✅ 4. ตรวจสอบ User Login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId || decoded.user_id;
        fetchUserData(userId); 
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem("token"); // ลบ Token ถ้ามันพัง
      }
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await UserService.getUser(userId);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ลบ user storage ด้วย
    setUser(null);
    navigate("/login");
  };

  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm font-sans">
      <div className="container mx-auto px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center space-x-2 group">
             <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Cpu size={24} />
             </div>
             <h1 className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
               IT Store
             </h1>
          </NavLink>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* หมวดหมู่ Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors py-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
              >
                <Grid size={18} className="mr-2" /> หมวดหมู่สินค้า
              </button>
              
              {/* Dropdown Menu */}
              <div 
                className={`absolute left-0 mt-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top-left z-50 ${isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <ul className="py-2 max-h-96 overflow-y-auto">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <li key={category.category_id}>
                        <NavLink
                          to={`/bookcategories/category/${category.category_id}`} 
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-50 last:border-none"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {/* ✅ แก้ไข: ใช้ category_name หรือ name ตามที่มีใน DB */}
                          {category.category_name || category.name}
                        </NavLink>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-sm text-gray-400 text-center">กำลังโหลด...</li>
                  )}
                </ul>
              </div>
            </div>

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `flex items-center font-medium transition-colors ${isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-600"}`
              }
            >
              <ShoppingCart size={18} className="mr-2" /> ตะกร้า
            </NavLink>
          </div>

          {/* Search & User Section */}
          <div className="flex items-center space-x-4">
            
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full border border-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all w-72">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า..."
                  className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Search Results */}
              {filteredProducts.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50">
                  {filteredProducts.map((product) => (
                    <NavLink
                      key={product.product_id || product.id}
                      to={`/content/${product.product_id || product.id}`}
                      className="flex items-center p-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-none group"
                      onClick={() => setSearchTerm("")}
                    >
                      <img
                        src={product.product_image || "https://placehold.co/100"} 
                        alt={product.product_name}
                        className="w-12 h-12 object-contain rounded-lg mr-3 border bg-white p-1"
                      />
                      <div className="overflow-hidden">
                        <h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-blue-600">
                          {product.product_name}
                        </h3>
                        <p className="text-xs text-blue-600 font-bold">฿{Number(product.price).toLocaleString()}</p>
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 focus:outline-none bg-gray-50 hover:bg-gray-100 py-1 px-2 rounded-full transition border border-transparent hover:border-gray-200"
                >
                  <img
                    src={user.pictureUrl || user.picture || "https://placehold.co/100"}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border border-gray-200"
                  />
                  <span className="hidden md:block text-sm font-bold text-slate-700 max-w-[100px] truncate">{user.username}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 origin-top-right animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    {/* Admin Menu */}
                    {(user.role === 'admin' || user.role === 'superadmin') && (
                      <NavLink 
                        to="/admin" 
                        className="flex items-center px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User size={16} className="mr-2" /> Admin Panel
                      </NavLink>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
                    >
                      <LogOut size={16} className="mr-2" /> ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors bg-gray-50 hover:bg-blue-50 px-4 py-2 rounded-full">
                <User size={18} className="mr-2" />
                <span className="hidden md:inline">เข้าสู่ระบบ</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;