import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Loader2 } from "lucide-react";
import ProductService from "../Services/Product.service";
import ReviewService from "../Services/Review.service";
import Layout from "../components/Layout";
// import Slideshow from "../components/Slideshow";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topRatingProducts, setTopRatingProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // แยกการเรียก API เพื่อไม่ให้ตัวใดตัวหนึ่งล่มแล้วพังทั้งหมด
        const productsRes = await ProductService.getProducts().catch(e => ({ data: [] }));
        const topRes = await ProductService.getTopProducts(10).catch(e => ({ data: [] }));
        const ratingRes = await ProductService.getTopRatingProducts(10).catch(e => ({ data: [] }));
        const reviewRes = await ReviewService.getReview(10).catch(e => ({ data: [] }));

        setProducts(productsRes.data || []);
        setTopProducts(topRes.data || []);
        setTopRatingProducts(ratingRes.data || []);
        setReviews(reviewRes.data || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Card Component สำหรับแสดงสินค้า
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group overflow-hidden">
      {/* ✅ แก้ไข: ใช้ product_id แทน _id */}
      <Link to={`/content/${product.product_id}`} className="relative pt-[100%] block bg-gray-50 overflow-hidden">
        <img
          src={product.product_image || "https://placehold.co/400"}
          alt={product.product_name}
          className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock <= 0 && (
           <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">หมด</div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-xs text-gray-500 mb-1">{product.brand || "IT Brand"}</p>
          <Link to={`/content/${product.product_id}`}>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-primary transition-colors min-h-[40px]" title={product.product_name}>
              {product.product_name}
            </h3>
          </Link>
        </div>
        
        <div className="mt-4 pt-2 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">฿{product.price?.toLocaleString()}</span>
          </div>
          <button className="bg-gray-100 hover:bg-primary hover:text-white p-2 rounded-lg transition-colors text-gray-600">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      {/* <Slideshow /> */}
      
      {/* Banner / Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 py-12 px-4 text-center shadow-inner relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">Welcome To IT Store</h1>
          <p className="text-blue-100 text-sm md:text-base">ศูนย์รวมอุปกรณ์ไอที คอมพิวเตอร์ และแกดเจ็ตครบวงจร</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <>
            {/* Section: สินค้าใหม่ */}
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-8 bg-primary rounded-full block"></span>
                  สินค้าใหม่ล่าสุด
                </h2>
              </div>
              
              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {products.slice(0, 10).map((product) => (
                    // ✅ แก้ไข: ใช้ product_id แทน _id
                    <ProductCard key={product.product_id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">ไม่พบข้อมูลสินค้า</p>
              )}
            </section>

            {/* Section: สินค้ายอดนิยม */}
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-red-500">🔥</span>
                  สินค้ายอดนิยม
                </h2>
              </div>
              {topProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {topProducts.slice(0, 5).map((product) => (
                    <ProductCard key={product.product_id} product={product} />
                  ))}
                </div>
              ) : (
                 <p className="text-center text-gray-500 py-8">กำลังประมวลผลสินค้ายอดนิยม...</p>
              )}
            </section>

            {/* จัดอันดับ Ranking */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏆 จัดอันดับประจำสัปดาห์</h2>
              <div className="grid md:grid-cols-2 gap-8 justify-center">
                
                {/* Top Rated Products */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-lg text-gray-700 border-b pb-3 mb-3 flex items-center gap-2">
                    <Star className="text-yellow-500" size={20} /> สินค้าคะแนนสูงสุด
                  </h3>
                  <div className="space-y-3">
                    {topRatingProducts.slice(0, 5).map((product, idx) => (
                      <Link to={`/content/${product.product_id}`} key={product.product_id} className="flex items-center gap-4 group p-2 rounded-lg hover:bg-white hover:shadow-sm transition">
                        <span className={`text-xl font-bold w-8 text-center ${idx < 3 ? 'text-yellow-500' : 'text-gray-400'}`}>#{idx + 1}</span>
                        <div className="w-12 h-12 bg-white rounded border border-gray-200 p-1 flex-shrink-0">
                             <img src={product.product_image} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary">{product.product_name}</p>
                          <div className="flex items-center text-xs text-yellow-500 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} fill={i < Math.round(product.averageRating || 0) ? "currentColor" : "none"} className={i < Math.round(product.averageRating || 0) ? "text-yellow-500" : "text-gray-300"} />
                            ))}
                            <span className="ml-2 text-gray-500">({product.averageRating?.toFixed(1) || "0.0"})</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Top Reviewers */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-lg text-gray-700 border-b pb-3 mb-3 flex items-center gap-2">
                    <span className="text-blue-500">💬</span> นักรีวิวสูงสุด
                  </h3>
                  <div className="space-y-3">
                    {reviews.slice(0, 5).map((review, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-2 rounded-lg hover:bg-white hover:shadow-sm transition">
                        <span className={`text-xl font-bold w-8 text-center ${idx < 3 ? 'text-blue-500' : 'text-gray-400'}`}>#{idx + 1}</span>
                        <img src={review.pictureUrl || review.picture || "https://placehold.co/100"} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{review.username || "User"}</p>
                          <p className="text-xs text-gray-500">{review.review_count} รีวิว</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;