import React from "react";
import { NavLink } from "react-router-dom";
import { Facebook, Instagram, Youtube, X, Gamepad2, Cpu, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  // ข้อมูลหมวดหมู่สินค้า IT
  const categories = [
    { category_id: "1", name: "Laptops & Notebooks" },
    { category_id: "2", name: "PC Components" },
    { category_id: "3", name: "Gaming Gear" },
    { category_id: "4", name: "Monitors" },
    { category_id: "5", name: "Accessories" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-6 text-gray-600 font-sans">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand info */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
               <div className="bg-blue-600 p-2 rounded-lg text-white">
                  <Cpu size={24} />
               </div>
               <h1 className="text-2xl font-bold text-slate-800 tracking-tight">IT Store</h1>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              ศูนย์รวมอุปกรณ์คอมพิวเตอร์และแกดเจ็ตที่ครบวงจรที่สุด 
              สินค้าคุณภาพ รับประกันศูนย์แท้ พร้อมบริการจัดส่งทั่วประเทศ
            </p>
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <MapPin size={16} /> <span>123 Tech Valley, Bangkok</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone size={16} /> <span>02-999-9999</span>
                </div>
                <div className="flex items-center gap-2">
                    <Mail size={16} /> <span>contact@itstore.com</span>
                </div>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">หมวดหมู่สินค้า</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.category_id}>
                  <NavLink
                    to={`/bookcategories/category/${category.category_id}`} // เปลี่ยน path นี้ให้ตรงกับ Route จริงของคุณถ้ามีการแก้
                    className="hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 hover:translate-x-1 transform"
                  >
                    - {category.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help & Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">ช่วยเหลือ & บริการ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink to="/about" className="hover:text-blue-600 transition-colors hover:translate-x-1 transform inline-block">
                  เกี่ยวกับเรา
                </NavLink>
              </li>
              <li>
                <NavLink to="/warranty" className="hover:text-blue-600 transition-colors hover:translate-x-1 transform inline-block">
                  เงื่อนไขการรับประกัน
                </NavLink>
              </li>
              <li>
                <NavLink to="/shipping" className="hover:text-blue-600 transition-colors hover:translate-x-1 transform inline-block">
                  การจัดส่งสินค้า
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="hover:text-blue-600 transition-colors hover:translate-x-1 transform inline-block">
                  ติดต่อสอบถาม
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
             <h3 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">ติดตามเรา</h3>
             <div className="flex space-x-3">
                <SocialLink href="https://www.facebook.com/profile.php?id=100026794388587#" icon={<Facebook size={20} />} />
                <SocialLink href="https://www.instagram.com/nutchanon.n_/" icon={<Instagram size={20} />} />
                <SocialLink href="https://www.youtube.com/watch?v=iKR02ihc3sU" icon={<Youtube size={20} />} />
                <SocialLink href="https://twitter.com" icon={<X size={20} />} />
                <SocialLink href="#" icon={<Gamepad2 size={20} />} />
             </div>
             <div className="mt-6">
                <p className="text-xs text-gray-400 mb-2">รับข่าวสารโปรโมชั่นใหม่ๆ</p>
                <div className="flex">
                    <input type="email" placeholder="อีเมลของคุณ" className="bg-gray-100 border border-gray-200 rounded-l-md px-3 py-2 text-sm w-full outline-none focus:border-blue-500" />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md text-sm font-medium hover:bg-blue-700 transition">Go</button>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2025 IT Store System. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
             <span className="cursor-pointer hover:text-blue-600">Privacy Policy</span>
             <span className="cursor-pointer hover:text-blue-600">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Component ย่อยสำหรับปุ่ม Social (เพื่อลด code ซ้ำซ้อน)
const SocialLink = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
  >
    {icon}
  </a>
);

export default Footer;