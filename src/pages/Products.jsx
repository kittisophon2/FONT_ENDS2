import React, { useEffect, useState } from "react";
import ProductService from "../Services/Product.service";
import CartService from "../Services/Cart.service";
import Layout from "../components/Layout";
import { Search, ShoppingCart } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = async (product) => {
    // 1. ตรวจสอบ Login
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("กรุณาเข้าสู่ระบบก่อนซื้อสินค้า");
      window.location.href = "/login";
      return;
    }
    const user = JSON.parse(userStr);

    try {
      // ⚠️ จุดสำคัญ: ต้องใช้ product.product_id (ห้ามใช้ product.id)
      const productId = product.product_id; 
      
      console.log("Adding Product ID:", productId); // เช็คใน Console ต้องเป็นรหัสยาวๆ

      if (!productId) {
        alert("เกิดข้อผิดพลาด: ไม่พบรหัสสินค้า (Product ID is missing)");
        return;
      }

      await CartService.addToCart(user.user_id, productId, 1);
      alert(`เพิ่ม "${product.product_name}" ลงตะกร้าแล้ว!`);
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">สินค้าทั้งหมด</h1>
        
        {/* Search Bar */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.product_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full border border-gray-100">
              <div className="h-48 overflow-hidden bg-gray-50 flex justify-center items-center p-4">
                <img
                  src={product.product_image || "https://placehold.co/300x300?text=No+Image"}
                  alt={product.product_name}
                  className="h-full object-contain hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{product.product_name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">฿{product.price.toLocaleString()}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-md flex items-center gap-2 px-4"
                  >
                    <ShoppingCart size={18} /> <span className="text-sm font-medium">เพิ่มใส่ตะกร้า</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Products;