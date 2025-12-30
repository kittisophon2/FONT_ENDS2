import React from "react";
import { NavLink } from "react-router-dom";
import { Facebook, Instagram, Youtube, X, Gamepad2 } from "lucide-react";

const categories = [
  { category_id: "67bb277d483ab08559a89753", name: "Fiction" },
  { category_id: "67bb277d483ab08559a89754", name: "Non-Fiction" },
  { category_id: "67bb277d483ab08559a89755", name: "Graphic Novels & Comics" },
  { category_id: "67bb277d483ab08559a89756", name: "Fantasy" },
  { category_id: "67bb277d483ab08559a89757", name: "Romance" },
  { category_id: "67bb277d483ab08559a89758", name: "Business & Economics" },
  { category_id: "67bb277d483ab08559a89759", name: "Science Fiction" },
  { category_id: "67bb36a914a1c18db1a6ba76", name: "Mystery" },
];

const Footer = () => {
  return (
    <footer className="grid grid-cols-5 gap-8 w-full text-sm text-center bg-[#F4FCF9] text-black py-6 border-t border-gray-300">
      {/* Logo */}
      <div className="flex flex-col items-center col-span-1">
        <img src="/pic/gogo.png" alt="Book Trees" className="ml-10" />
      </div>

      {/* Title */}
      <div className="flex flex-col justify-center col-span-1 pl-24">
        <h1 className="text-8xl font-custom logo">Book</h1>
      </div>
      <div className="flex flex-col justify-center col-span-1 pr-96">
        <h1 className="text-8xl font-custom logo">Trees</h1>
      </div>

      <div className="space-x-4 flex">
        {/* Categories */}
        <div className="col-span-1">
          <h2 className="font-semibold">หมวดหมู่</h2>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.category_id}>
                <NavLink
                  to={`/bookcategories/category/${category.category_id}`}
                  className="hover:text-gray-700"
                >
                  {category.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div className="col-span-1">
          <h2 className="font-semibold">เกี่ยวกับ</h2>
          <ul className="space-y-1">
            <li>
              <NavLink to="/about" className="hover:text-gray-700">
                BookTrees ?
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="hover:text-gray-700">
                ความตั้งใจ
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Icons */}
      <div className="col-span-1 flex flex-col items-center">
        <h2 className="font-semibold">ติดตามเรา</h2>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="https://www.youtube.com/watch?v=iKR02ihc3sU"
          target="blank">
          <X size={20} className="cursor-pointer" />
          </a>
          <a href="https://www.youtube.com/watch?v=iKR02ihc3sU"
          target="blank">
          <Youtube size={20} className="cursor-pointer" />
          </a>
          <a href="https://www.instagram.com/nutchanon.n_/"
          target="blank">
          <Instagram size={20} className="cursor-pointer" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=100026794388587#"
          target="blank">
          <Facebook size={20} className="cursor-pointer" />
          </a>
          <a href="https://www.youtube.com/watch?v=iKR02ihc3sU"
          target="blank">
          <Gamepad2 size={20} className="cursor-pointer" />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="col-span-5 text-sm text-gray-600 mt-4 border-t pt-2 w-full text-center">
        © 2025 BookTrees | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
