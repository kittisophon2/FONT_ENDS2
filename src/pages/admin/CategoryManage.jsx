import React, { useEffect, useState } from "react";
import CategoryService from "../../Services/Category.service";
import { Trash2, Edit, Plus, X, Layers, Search, Loader2 } from "lucide-react";

const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.getAllCategories();
      // รองรับกรณี response.data หรือ response เป็น array ตรงๆ
      setCategories(response.data || response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (category = null) => {
    if (category) {
      setIsEditing(true);
      setCurrentCategory(category);
      // ตรวจสอบชื่อ field จาก DB ว่าเป็น 'name' หรือ 'category_name'
      setFormData({ name: category.name || category.category_name });
    } else {
      setIsEditing(false);
      setCurrentCategory(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // เตรียมข้อมูล (Backend รับ field ชื่อ 'name')
      const data = { name: formData.name };

      if (isEditing) {
        await CategoryService.updateCategory(currentCategory.category_id, data);
        alert("แก้ไขหมวดหมู่เรียบร้อย!");
      } else {
        await CategoryService.createCategory(data);
        alert("เพิ่มหมวดหมู่เรียบร้อย!");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Save Error:", error);
      alert("เกิดข้อผิดพลาด: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่? หากลบหมวดหมู่นี้ สินค้าที่ผูกอยู่จะถูกลบความสัมพันธ์หมวดหมู่ออกด้วย!")) {
      try {
        await CategoryService.deleteCategory(id);
        setCategories(categories.filter((c) => c.category_id !== id));
        alert("ลบหมวดหมู่เรียบร้อย");
      } catch (error) {
        console.error("Delete Error:", error);
        alert("ลบไม่สำเร็จ: " + (error.response?.data?.error || error.message));
      }
    }
  };

  // Filter
  const filteredCategories = Array.isArray(categories) ? categories.filter(cat => 
    (cat.name || cat.category_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             <Layers className="text-blue-600" /> จัดการหมวดหมู่สินค้า
           </h2>
           <p className="text-gray-500 text-sm mt-1">เพิ่ม ลบ แก้ไข ประเภทสินค้าในร้าน</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
             <input 
               type="text" 
               placeholder="ค้นหาหมวดหมู่..." 
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
            <Plus size={20} /> เพิ่มหมวดหมู่
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="py-4 px-6 text-center w-20">#</th>
              <th className="py-4 px-6">ชื่อหมวดหมู่</th>
              <th className="py-4 px-6 text-center w-40">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="3" className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-10 text-gray-400">ไม่พบข้อมูล</td></tr>
            ) : (
              filteredCategories.map((cat, index) => (
                <tr key={cat.category_id} className="hover:bg-blue-50/50 transition duration-150">
                  <td className="py-3 px-6 text-center text-gray-400">{index + 1}</td>
                  <td className="py-3 px-6 font-bold text-gray-700 text-base">
                    {cat.name || cat.category_name}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openModal(cat)}
                        className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition shadow-sm"
                        title="แก้ไข"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.category_id)}
                        className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm"
                        title="ลบ"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {isEditing ? <Edit size={20} className="text-yellow-500" /> : <Plus size={20} className="text-blue-500" />}
                {isEditing ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition rounded-full p-1 hover:bg-red-50">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อหมวดหมู่</label>
                <input 
                  type="text" name="name" required autoFocus
                  value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="เช่น อุปกรณ์คอมพิวเตอร์"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition">ยกเลิก</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManage;