import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, User, Monitor, Grid, Info, ShoppingCart, Cpu } from "lucide-react"; // เปลี่ยน icon
import { jwtDecode } from "jwt-decode";
import ProductService from "../Services/Product.service";
import UserService from "../Services/User.service";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]); // เปลี่ยนชื่อให้สื่อความหมาย
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // ข้อมูลหมวดหมู่ตัวอย่างสำหรับร้าน IT (คุณควรดึงจาก API จริงๆ ถ้าทำได้)
  const categories = [
    { category_id: "1", name: "Laptops & Notebooks" },
    { category_id: "2", name: "PC Components" },
    { category_id: "3", name: "Peripherals (Mouse/Keybaord)" },
    { category_id: "4", name: "Monitors" },
    { category_id: "5", name: "Accessories" },
  ];

  useEffect(() => {
    ProductService.getProducts()
      .then((response) => setProducts(response.data))
      .catch((e) => console.log(e));
  }, []);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // เช็ค field id จาก token ว่าชื่อ userId หรือ user_id ให้ตรงกับ backend
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
             {/* เปลี่ยนรูป logo เป็นของร้าน IT หรือใช้ icon แทนชั่วคราว */}
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
              >
                <Grid size={20} className="mr-2" /> หมวดหมู่สินค้า
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top-left ${isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible'}`}>
                <ul className="py-2">
                  {categories.map((category) => (
                    <li key={category.category_id}>
                      <NavLink
                        to={`/bookcategories/category/${category.category_id}`} // อาจต้องเปลี่ยน path เป็น /categories/...
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {category.name}
                      </NavLink>
                    </li>
                  ))}
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

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center font-medium transition-colors ${isActive ? "text-primary" : "text-gray-600 hover:text-primary"}`
              }
            >
              <Info size={20} className="mr-2" /> เกี่ยวกับเรา
            </NavLink>
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
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <NavLink
                      key={product._id} // Prisma ใช้ _id หรือ product_id เช็คให้ดีครับ (Schema บอก product_id map เป็น _id)
                      to={`/content/${product._id}`}
                      className="flex items-center p-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-none"
                    >
                      <img
                        src={product.product_image || "https://placehold.co/100"} // ใช้ field จาก schema
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
                    src={user.picture || "https://placehold.co/100"} // Schema ใช้ picture
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover border border-gray-200"
                  />
                  <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.username}</span>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-200">
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