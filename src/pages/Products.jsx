import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import ProductService from "../Services/Product.service"; 
import Layout from "../components/Layout";
import { Loader2, ShoppingCart } from "lucide-react";

// ✅ เปลี่ยนชื่อ Component จาก Books เป็น Products
const Products = () => {
  const { category_id } = useParams();
  const [products, setProducts] = useState([]); 
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category_id) {
      setLoading(true);
      ProductService.getProductsByCategory(category_id)
        .then((response) => {
          setCategoryName(response.data.name);
          setProducts(response.data.products || []);
        })
        .catch((e) => {
          console.error("API Error:", e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [category_id]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">
          📦 สินค้าหมวดหมู่: <span className="text-blue-600">{categoryName}</span>
        </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-8"></div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => {
              const product = item.product; 
              
              return (
                <div 
                  key={product.product_id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group overflow-hidden"
                >
                  <NavLink to={`/content/${product.product_id}`} className="relative pt-[100%] block bg-gray-50 overflow-hidden">
                    <img
                      src={product.product_image || "https://placehold.co/400"}
                      alt={product.product_name}
                      className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                     {product.stock <= 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">หมด</div>
                     )}
                  </NavLink>

                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex-grow">
                        <p className="text-xs text-gray-400 mb-1">{product.brand || "IT Brand"}</p>
                        <NavLink to={`/content/${product.product_id}`}>
                            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors mb-2 min-h-[40px]">
                            {product.product_name}
                            </h3>
                        </NavLink>
                    </div>

                    <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-xs text-gray-500">ราคา</span>
                         <span className="text-lg font-bold text-blue-600">฿{product.price?.toLocaleString()}</span>
                      </div>
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
            <p className="text-xl text-gray-500 font-medium">🚫 ไม่พบสินค้าในหมวดหมู่นี้</p>
            <p className="text-gray-400 text-sm mt-2">ลองเลือกหมวดหมู่อื่นดูนะครับ</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

// ✅ Export ชื่อใหม่
export default Products;