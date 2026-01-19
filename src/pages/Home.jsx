import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import ProductService from "../Services/Product.service";
import ReviewService from "../Services/Review.service";
import Layout from "../components/Layout";
import Slideshow from "../components/Slideshow";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topRatingProducts, setTopRatingProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [all, top, rating, rev] = await Promise.all([
          ProductService.getProducts(),
          ProductService.getTopProducts(10),
          ProductService.getTopRatingProducts(10),
          ReviewService.getReview(10)
        ]);
        
        setProducts(all.data);
        setTopProducts(top.data);
        setTopRatingProducts(rating.data);
        setReviews(rev.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  // Card Component สำหรับแสดงสินค้า (Reuse ได้)
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group overflow-hidden">
      <Link to={`/content/${product._id}`} className="relative pt-[100%] block bg-gray-50">
        <img
          src={product.product_image || "https://placehold.co/400"} // ใช้ default image ถ้าไม่มีรูป
          alt={product.product_name}
          className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock <= 0 && (
           <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">หมด</div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-xs text-gray-500 mb-1">{product.brand || "IT Brand"}</p>
          <Link to={`/content/${product._id}`}>
            <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-primary transition-colors h-12" title={product.product_name}>
              {product.product_name}
            </h3>
          </Link>
        </div>
        
        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-primary">฿{product.price?.toLocaleString()}</span>
          </div>
          <button className="bg-gray-100 hover:bg-primary hover:text-white p-2 rounded-lg transition-colors">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <Slideshow />
      
      {/* Banner / Hero Section แทนรูป bgtree เดิม */}
      <div className="bg-gradient-to-r from-secondary to-blue-900 py-12 px-4 text-center shadow-inner">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Welcome To IT Store</h1>
        <p className="text-gray-300">ศูนย์รวมอุปกรณ์ไอที คอมพิวเตอร์ และแกดเจ็ตครบวงจร</p>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Section: สินค้าใหม่ */}
        <section>
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-8 bg-primary rounded-full block"></span>
              สินค้าใหม่ล่าสุด
            </h2>
            <Link to="/all-products" className="text-sm text-primary hover:underline">ดูทั้งหมด</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.slice(0, 10).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* Section: สินค้ายอดนิยม (เปลี่ยนจาก Slide เป็น Grid เพื่อความ Modern) */}
        <section>
           <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-red-500">🔥</span>
              สินค้ายอดนิยม
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {topProducts.slice(0, 5).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* จัดอันดับ Ranking (ปรับดีไซน์ให้เป็นการ์ด Modern) */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏆 จัดอันดับประจำสัปดาห์</h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Top Reviews */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-700 border-b pb-2">⭐ สินค้าคะแนนสูงสุด</h3>
              {topRatingProducts.slice(0, 5).map((product, idx) => (
                <Link to={`/content/${product._id}`} key={product._id} className="flex items-center gap-4 group p-2 rounded hover:bg-gray-50 transition">
                  <span className={`text-xl font-bold w-6 ${idx < 3 ? 'text-yellow-500' : 'text-gray-400'}`}>#{idx + 1}</span>
                  <img src={product.product_image} alt="" className="w-12 h-12 object-contain bg-white border rounded" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary">{product.product_name}</p>
                    <div className="flex items-center text-xs text-yellow-500">
                      <Star size={12} fill="currentColor" /> 
                      <span className="ml-1 text-gray-600">{product.averageRating?.toFixed(1) || "5.0"}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Top Reviewers */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-700 border-b pb-2">💬 นักรีวิวสูงสุด</h3>
              {reviews.slice(0, 5).map((review, idx) => (
                <div key={review.user_id} className="flex items-center gap-4 p-2">
                  <span className={`text-xl font-bold w-6 ${idx < 3 ? 'text-primary' : 'text-gray-400'}`}>#{idx + 1}</span>
                  <img src={review.pictureUrl || review.picture} alt="" className="w-10 h-10 rounded-full object-cover border" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.username}</p>
                    <p className="text-xs text-gray-500">{review.review_count} รีวิว</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;