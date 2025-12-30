import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Registers from './pages/Register'
import Treasury from './pages/Treasury'
import Books  from './pages/Books'
import About from './pages/About'
import Register from './pages/Register'
import Content from './pages/Content'
import Login from './pages/Login'



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
        <Route path="/bookcategories/category/:category_id" element={<Books />} />
       
      </Routes>
    </BrowserRouter>
  )
}

export default App