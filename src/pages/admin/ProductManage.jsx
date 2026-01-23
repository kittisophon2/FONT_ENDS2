import React, { useEffect, useState } from "react";
import ProductService from "../../Services/Product.service";
import CategoryService from "../../Services/Category.service"; // ถ้ามี Service นี้
import { Trash2, Edit, Plus, X, Image as ImageIcon, Loader2 } from "lucide-react";

const ProductManage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ถ้ามีระบบหมวดหมู่
  const [loading, setLoading] = useState(true);
  
  // State สำหรับ Modal (เพิ่ม/แก้ไข)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // State สำหรับ Form Data
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    product_image: null, // ไฟล์รูปภาพ
  });
  const [imagePreview, setImagePreview] = useState(null);

  // 1. โหลดข้อมูลสินค้า
  useEffect(() => {
    fetchProducts();
    // fetchCategories(); // เปิดใช้ถ้ามี API หมวดหมู่
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. ฟังก์ชันจัดการ Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, product_image: file });
      setImagePreview(URL.createObjectURL(file)); // แสดงรูปตัวอย่าง
    }
  };

  // 3. เปิด Modal (เพิ่ม/แก้ไข)
  const openModal = (product = null) => {
    if (product) {
      // โหมดแก้ไข
      setIsEditing(true);
      setCurrentProduct(product);
      setFormData({
        product_name: product.product_name,
        description: product.description || "",
        price: product.price,
        stock: product.stock,
        brand: product.brand || "",
        product_image: null, // รีเซ็ตรูปใหม่
      });
      // รูปเดิมจาก Server
      setImagePreview(product.product_image); 
    } else {
      // โหมดเพิ่มใหม่
      setIsEditing(false);
      setCurrentProduct(null);
      setFormData({
        product_name: "",
        description: "",
        price: "",
        stock: "",
        brand: "",
        product_image: null,
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  // 4. บันทึกข้อมูล (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // เตรียมข้อมูลแบบ Multipart Form Data (สำหรับส่งรูป)
    const data = new FormData();
    data.append("product_name", formData.product_name);
    data.append("description", formData.description);
    data.append("price", formData.price); // Backend อาจต้องการ Int, ระวังตรงนี้
    data.append("stock", formData.stock); // Backend อาจต้องการ Int
    data.append("brand", formData.brand);
    
    if (formData.product_image) {
      data.append("product_image", formData.product_image); // ชื่อ field ต้องตรงกับ Backend (upload.single('product_image'))
    }

    try {
      if (isEditing) {
        await ProductService.updateProduct(currentProduct.product_id, data);
        alert("แก้ไขสินค้าเรียบร้อย!");
      } else {
        await ProductService.createProduct(data);
        alert("เพิ่มสินค้าเรียบร้อย!");
      }
      setIsModalOpen(false);
      fetchProducts(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Save Error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก: " + (error.response?.data?.error || error.message));
    }
  };

  // 5. ลบสินค้า
  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?")) {
      try {
        await ProductService.deleteProduct(id);
        setProducts(products.filter(p => p.product_id !== id));
        alert("ลบสินค้าเรียบร้อย");
      } catch (error) {
        console.error("Delete Error:", error);
        alert("ลบไม่สำเร็จ");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">จัดการสินค้า</h2>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
        >
          <Plus size={20} /> เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* ตารางแสดงสินค้า */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 rounded-l-lg">รูปภาพ</th>
              <th className="py-3 px-4">ชื่อสินค้า</th>
              <th className="py-3 px-4">ราคา</th>
              <th className="py-3 px-4">สต็อก</th>
              <th className="py-3 px-4">แบรนด์</th>
              <th className="py-3 px-4 rounded-r-lg text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10">ไม่มีสินค้าในระบบ</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.product_id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img 
                      src={product.product_image || "https://placehold.co/100"} 
                      alt="product" 
                      className="w-12 h-12 object-cover rounded-lg border"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{product.product_name}</td>
                  <td className="py-3 px-4 text-blue-600 font-bold">฿{Number(product.price).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                      {product.stock} ชิ้น
                    </span>
                  </td>
                  <td className="py-3 px-4">{product.brand || "-"}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex item-center justify-center gap-2">
                      <button 
                        onClick={() => openModal(product)}
                        className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.product_id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
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

      {/* Modal (Popup Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">
                {isEditing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-4 mb-4">
                <div className="w-32 h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-400" size={40} />
                  )}
                </div>
                <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition text-sm">
                  เลือกรูปภาพ
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
                  <input 
                    type="text" name="product_name" required
                    value={formData.product_name} onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท)</label>
                  <input 
                    type="number" name="price" required min="0"
                    value={formData.price} onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนสต็อก</label>
                  <input 
                    type="number" name="stock" required min="0"
                    value={formData.stock} onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">แบรนด์</label>
                  <input 
                    type="text" name="brand"
                    value={formData.brand} onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                  <textarea 
                    name="description" rows="3"
                    value={formData.description} onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
                >
                  {isEditing ? "บันทึกแก้ไข" : "ยืนยันเพิ่มสินค้า"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManage;