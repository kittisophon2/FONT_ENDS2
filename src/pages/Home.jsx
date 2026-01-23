import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, Loader2, Award, MessageCircle } from "lucide-react";
import ProductService from "../Services/Product.service";
import ReviewService from "../Services/Review.service";
import CartService from "../Services/Cart.service";
import Layout from "../components/Layout";
// import Slideshow from "../components/Slideshow"; // เปิดใช้เมื่อต้องการ

const Home = () => {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topRatingProducts, setTopRatingProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ✅ แก้ไข: ใช้ getAllProducts ให้ตรงกับ Service
        const productsRes = await ProductService.getAllProducts().catch(() => ({ data: [] }));
        
        // ถ้า Service อื่นยังไม่มีฟังก์ชันเหล่านี้ ให้คอมเมนต์ปิดไว้ก่อนเพื่อกัน Error
        // const topRes = await ProductService.getTopProducts(10).catch(() => ({ data: [] }));
        // const ratingRes = await ProductService.getTopRatingProducts(10).catch(() => ({ data: [] }));
        // const reviewRes = await ReviewService.getReview(10).catch(() => ({ data: [] }));

        setProducts(productsRes.data || []);
        // setTopProducts(topRes.data || []);
        // setTopRatingProducts(ratingRes.data || []);
        // setReviews(reviewRes.data || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (e, product) => {
    e.preventDefault(); // ป้องกันไม่ให้ Link ทำงานเมื่อกดปุ่มตะกร้า
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("กรุณาเข้าสู่ระบบก่อนซื้อสินค้า");
      navigate("/login");
      return;
    }
    const user = JSON.parse(userStr);

    try {
      const productId = product.product_id || product.id;
      await CartService.addToCart(user.user_id, productId, 1);
      alert(`เพิ่ม "${product.product_name}" ลงตะกร้าแล้ว!`);
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group overflow-hidden relative">
      <Link to={`/content/${product.product_id}`} className="relative pt-[100%] block bg-gray-50 overflow-hidden">
        <img
          src={product.product_image || "https://placehold.co/400?text=No+Image"}
          alt={product.product_name}
          className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
        {product.stock <= 0 && (
           <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10">หมด</div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{product.brand || "IT Brand"}</p>
          <Link to={`/content/${product.product_id}`}>
            <h3 className="text-sm font-bold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors min-h-[40px]" title={product.product_name}>
              {product.product_name}
            </h3>
          </Link>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-blue-600">฿{Number(product.price).toLocaleString()}</span>
          </div>
          <button 
            onClick={(e) => handleAddToCart(e, product)}
            className="bg-gray-100 hover:bg-blue-600 hover:text-white p-2.5 rounded-full transition-all shadow-sm text-gray-600"
            title="เพิ่มใส่ตะกร้า"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      {/* <Slideshow /> */}
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 py-16 px-4 text-center shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
            Welcome To IT Store
          </h1>
          <p className="text-blue-100 text-lg">ศูนย์รวมอุปกรณ์ไอที คอมพิวเตอร์ และแกดเจ็ตครบวงจร</p>
        </div>
        {/* Background Pattern (Optional) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-400">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p>กำลังโหลดข้อมูลสินค้า...</p>
          </div>
        ) : (
          <>
            {/* Section: สินค้าทั้งหมด */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-blue-600 rounded-full block"></span>
                  สินค้าแนะนำ
                </h2>
                <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                  ดูทั้งหมด <ChevronRight size={16} />
                </Link>
              </div>
              
              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {products.slice(0, 10).map((product) => (
                    <ProductCard key={product.product_id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-gray-500">ไม่พบข้อมูลสินค้าในขณะนี้</p>
                </div>
              )}
            </section>

            {/* ส่วนจัดอันดับ (Placeholder - ถ้า API ยังไม่พร้อม ข้อมูลส่วนนี้จะว่าง) */}
            {(topRatingProducts.length > 0 || reviews.length > 0) && (
              <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center flex items-center justify-center gap-2">
                  <Award className="text-yellow-500" /> จัดอันดับประจำสัปดาห์
                </h2>
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                  
                  {/* Top Rated */}
                  {topRatingProducts.length > 0 && (
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                      <h3 className="font-bold text-lg text-slate-700 border-b pb-4 mb-4 flex items-center gap-2">
                        <Star className="text-yellow-500" size={20} fill="currentColor" /> สินค้าคะแนนสูงสุด
                      </h3>
                      <div className="space-y-4">
                        {topRatingProducts.slice(0, 5).map((product, idx) => (
                          <Link to={`/content/${product.product_id}`} key={product.product_id} className="flex items-center gap-4 group p-3 rounded-xl hover:bg-white hover:shadow-md transition duration-200">
                            <span className={`text-2xl font-black w-8 text-center ${idx < 3 ? 'text-yellow-500' : 'text-gray-300'}`}>#{idx + 1}</span>
                            <div className="w-14 h-14 bg-white rounded-lg border border-gray-200 p-1 flex-shrink-0">
                                 <img src={product.product_image} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0 flex-grow">
                              <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600">{product.product_name}</p>
                              <div className="flex items-center text-xs text-yellow-500 mt-1 gap-1">
                                <Star size={12} fill="currentColor" /> 
                                <span className="font-bold text-slate-600">{product.averageRating?.toFixed(1) || "5.0"}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Reviewers */}
                  {reviews.length > 0 && (
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                      <h3 className="font-bold text-lg text-slate-700 border-b pb-4 mb-4 flex items-center gap-2">
                        <MessageCircle className="text-blue-500" size={20} /> นักรีวิวสูงสุด
                      </h3>
                      <div className="space-y-4">
                        {reviews.slice(0, 5).map((review, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white hover:shadow-md transition duration-200 cursor-default">
                            <span className={`text-2xl font-black w-8 text-center ${idx < 3 ? 'text-blue-500' : 'text-gray-300'}`}>#{idx + 1}</span>
                            <img src={review.pictureUrl || "https://placehold.co/100"} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                            <div>
                              <p className="text-sm font-bold text-slate-800">{review.username || "User"}</p>
                              <p className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full inline-block mt-1">{review.review_count} รีวิว</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </section>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

// Component ช่วยสำหรับไอคอน (ถ้าไม่ได้ import มา)
function ChevronRight({ size = 24, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
  );
}

export default Home;