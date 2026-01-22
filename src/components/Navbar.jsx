import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, User, Monitor, Grid, Info, ShoppingCart, Cpu } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import ProductService from "../Services/Product.service";
import UserService from "../Services/User.service";
import CategoryService from "../Services/Category.service"; // ✅ Import Service

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ เปลี่ยนเป็น State ว่าง
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ 1. ดึงข้อมูลสินค้าทั้งหมดสำหรับ Search
  useEffect(() => {
    ProductService.getProducts()
      .then((response) => setProducts(response.data))
      .catch((e) => console.log("Error fetching products:", e));
  }, []);

  // ✅ 2. ดึงข้อมูลหมวดหมู่จาก Backend
  useEffect(() => {
    CategoryService.getCategories()
      .then((response) => {
        setCategories(response.data);
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
        // เช็ค field id ให้ครอบคลุมทั้ง userId และ user_id
        fetchUserData(decoded.userId || decoded.user_id); 
      } catch (error) {
        console.error("Invalid token");
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
    setUser(null);
    navigate("/login");
  };

  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center space-x-2 group">
             <div className="bg-primary p-2 rounded-lg text-white">
                <Cpu size={28} />
             </div>
             <h1 className="text-2xl font-bold text-secondary tracking-tight group-hover:text-primary transition-colors">
               IT Store
             </h1>
          </NavLink>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            
            {/* หมวดหมู่ Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center text-gray-600 hover:text-primary font-medium transition-colors py-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)} // เพิ่ม MouseEnter เพื่อความสะดวก
              >
                <Grid size={20} className="mr-2" /> หมวดหมู่สินค้า
              </button>
              
              {/* Dropdown Menu */}
              {/* แก้ไข logic การแสดงผล dropdown ให้ smooth ขึ้น */}
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
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-50 last:border-none"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {category.name}
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
                `flex items-center font-medium transition-colors ${isActive ? "text-primary" : "text-gray-600 hover:text-primary"}`
              }
            >
              <ShoppingCart size={20} className="mr-2" /> ตะกร้า
            </NavLink>

            {/* <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center font-medium transition-colors ${isActive ? "text-primary" : "text-gray-600 hover:text-primary"}`
              }
            >
              <Info size={20} className="mr-2" /> เกี่ยวกับเรา
            </NavLink> */}
          </div>

          {/* Search & User Section */}
          <div className="flex items-center space-x-4">
            
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full border border-transparent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all w-64">
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
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto z-50">
                  {filteredProducts.map((product) => (
                    <NavLink
                      key={product.product_id} // ✅ แก้ไข: ใช้ product_id แทน _id
                      to={`/content/${product.product_id}`} // ✅ แก้ไข path ให้ใช้ product_id
                      className="flex items-center p-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-none"
                      onClick={() => setSearchTerm("")} // ปิดผลการค้นหาเมื่อคลิก
                    >
                      <img
                        src={product.product_image || "https://placehold.co/100"} 
                        alt={product.product_name}
                        className="w-10 h-10 object-cover rounded-md mr-3 border"
                      />
                      <div className="overflow-hidden">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {product.product_name}
                        </h3>
                        <p className="text-xs text-primary font-bold">฿{product.price?.toLocaleString()}</p>
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
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={user.pictureUrl || user.picture || "https://placehold.co/100"} // ✅ เพิ่ม fallback ให้ pictureUrl
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover border border-gray-200"
                  />
                  <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.username}</span>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="flex items-center text-gray-600 hover:text-primary font-medium transition-colors">
                <User size={22} className="mr-1" />
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