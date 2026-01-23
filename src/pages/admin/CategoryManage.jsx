import React, { useEffect, useState } from "react";
import CategoryService from "../../Services/Category.service";
import { Trash2, Edit, Plus, X, List, Search, Loader2 } from "lucide-react";

const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (category = null) => {
    if (category) {
      setIsEditing(true);
      setCurrentCategory(category);
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
      const data = { name: formData.name };
      if (isEditing) {
        await CategoryService.updateCategory(currentCategory.category_id, data);
        alert("แก้ไขเรียบร้อย");
      } else {
        await CategoryService.createCategory(data);
        alert("เพิ่มเรียบร้อย");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("ต้องการลบหมวดหมู่นี้ใช่หรือไม่?")) {
      try {
        await CategoryService.deleteCategory(id);
        setCategories(categories.filter((c) => c.category_id !== id));
      } catch (error) {
        console.error("Error:", error);
        alert("ลบไม่สำเร็จ");
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    (cat.name || cat.category_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><List className="text-blue-600"/> จัดการหมวดหมู่</h2>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus size={20}/> เพิ่มหมวดหมู่</button>
      </div>
      
      <div className="mb-4">
        <input type="text" placeholder="ค้นหา..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="border p-2 rounded-lg w-full md:w-64"/>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-3 px-4">ชื่อหมวดหมู่</th>
              <th className="py-3 px-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="2" className="text-center py-4">Loading...</td></tr> : 
             filteredCategories.map((cat) => (
              <tr key={cat.category_id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{cat.name || cat.category_name}</td>
                <td className="py-3 px-4 text-center flex justify-center gap-2">
                  <button onClick={() => openModal(cat)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(cat.category_id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">{isEditing ? "แก้ไข" : "เพิ่ม"}หมวดหมู่</h3>
              <button onClick={() => setIsModalOpen(false)}><X/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="border w-full p-2 rounded mb-4" required placeholder="ชื่อหมวดหมู่"/>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 p-2 rounded">ยกเลิก</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManage;