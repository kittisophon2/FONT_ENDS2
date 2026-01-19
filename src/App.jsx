import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Registers from './pages/Register' // หน้า Register (อาจจะซ้ำกับ Register ด้านล่าง ตรวจสอบดูนะครับ)
import Treasury from './pages/Treasury'
// ❌ ลบอันเก่า: import Books from './pages/Books'
import Products from './pages/Products' // ✅ เพิ่มอันใหม่ (ให้ตรงกับชื่อไฟล์ที่คุณแก้ไป)
import About from './pages/About'
import Register from './pages/Register' // หน้า Register (ซ้ำกับ Registers ด้านบน)
import Content from './pages/Content'
import Login from './pages/Login'
import Cart from "./pages/Cart";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registers" element={<Registers />} />
        <Route path="/readings" element={<Treasury />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/content/:id" element={<Content />} />
        <Route path="/login" element={<Login/>} />
        
        {/* ✅ เปลี่ยนจาก <Books /> เป็น <Products /> และอาจเปลี่ยน path ให้สื่อความหมายมากขึ้น */}
        <Route path="/bookcategories/category/:category_id" element={<Products />} />
        
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App