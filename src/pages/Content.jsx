import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, Star, ShoppingCart, 
  CreditCard, Minus, Plus, Truck, ShieldCheck, Share2 
} from "lucide-react"; 
import ProductService from "../Services/Product.service";
import CartService from "../Services/Cart.service";
import UserService from "../Services/User.service";
import Layout from "../components/Layout";
import { jwtDecode } from "jwt-decode";

const Content = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  // States สำหรับการซื้อ
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // States สำหรับ Review
  const [newComment, setNewComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  // 1. Fetch Product Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ดึงข้อมูลสินค้าปัจจุบัน
        const productRes = await ProductService.getProductById(id);
        setProduct(productRes.data);
        setReviews(productRes.data.reviews || []);

        // ดึงสินค้าแนะนำ (Top Products)
        const topRes = await ProductService.getTopProducts();
        setRelatedProducts(topRes.data);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 2. Fetch User Data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchUserData(decoded.userId || decoded.user_id);
      } catch (e) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await UserService.getUser(userId);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  // 3. Handle Quantity Change
  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQty = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // 4. Add to Cart Logic
  const handleAddToCart = async (isBuyNow = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนซื้อสินค้า!");
      navigate("/login");
      return;
    }

    if (product.stock <= 0) {
      alert("สินค้าหมด!");
      return;
    }

    try {
      setAddingToCart(true);
      await CartService.addToCart(id, quantity);
      
      if (isBuyNow) {
        navigate("/cart");
      } else {
        alert(`✅ เพิ่ม ${product.product_name} จำนวน ${quantity} ชิ้น ลงตะกร้าแล้ว!`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า");
    } finally {
      setAddingToCart(false);
    }
  };

  // 5. Review Logic
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น");
      return;
    }
    if (!newComment.trim() || selectedRating === 0) {
      alert("กรุณาให้คะแนนและพิมพ์ข้อความ");
      return;
    }

    try {
      const response = await ProductService.addReview(
        id,
        user.user_id || user.userId,
        selectedRating,
        newComment
      );

      // Refresh reviews locally to show instantly
      const newReview = {
        review_id: Date.now(), // Temp ID
        rating: selectedRating,
        comment: newComment,
        review_date: new Date().toISOString(),
        user: {
          username: user.username,
          pictureUrl: user.pictureUrl || user.picture
        }
      };
      
      setReviews([...reviews, newReview]);
      setNewComment("");
      setSelectedRating(0);
    } catch (error) {
      console.error("❌ Error adding review:", error);
      alert("เกิดข้อผิดพลาดในการส่งความคิดเห็น");
    }
  };

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl text-gray-500 animate-pulse">กำลังโหลดข้อมูลสินค้า...</p>
      </div>
    </Layout>
  );

  if (!product) return (
    <Layout>
       <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl text-red-500">ไม่พบสินค้านี้</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">หน้าแรก</Link> 
          <span className="mx-2">/</span>
          <Link to="/all-products" className="hover:text-blue-600">สินค้าทั้งหมด</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{product.product_name}</span>
        </div>

        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              
              {/* Left Column: Image */}
              <div className="p-8 flex items-center justify-center bg-white border-b md:border-b-0 md:border-r border-gray-100 relative">
                <img
                  src={product.product_image || "https://placehold.co/600"}
                  alt={product.product_name}
                  className="max-h-[400px] w-auto object-contain hover:scale-105 transition-transform duration-500"
                />
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-6 py-2 rounded-full text-xl font-bold shadow-lg transform -rotate-12">
                      OUT OF STOCK
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Details */}
              <div className="p-8 flex flex-col">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-2 uppercase tracking-wide">
                    {product.brand || "IT Brand"}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                    {product.product_name}
                  </h1>
                  
                  {/* Rating Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                         <Star key={i} size={16} fill={i < Math.round(product.average_rating || 0) ? "currentColor" : "none"} className={i < Math.round(product.average_rating || 0) ? "" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({reviews.length} รีวิว)</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                      <ShieldCheck size={14} /> รับประกันศูนย์ไทย
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-3xl font-bold text-blue-600">฿{product.price?.toLocaleString()}</p>
                  <p className="text-sm text-gray-400 mt-1">ราคาลวมภาษีมูลค่าเพิ่มแล้ว</p>
                </div>

                <div className="flex-grow space-y-6">
                  {/* Stock & Quantity */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">จำนวน</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button 
                          onClick={decreaseQty}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          disabled={product.stock <= 0 || quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                        <button 
                          onClick={increaseQty}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          disabled={product.stock <= 0 || quantity >= product.stock}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        มีสินค้า {product.stock} ชิ้น
                      </span>
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 border border-gray-100">
                     <p className="line-clamp-3">{product.description || "รายละเอียดสินค้ากำลังปรับปรุง..."}</p>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleAddToCart(false)}
                      disabled={product.stock <= 0 || addingToCart}
                      className="flex-1 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={20} />
                      {addingToCart ? "กำลังเพิ่ม..." : "ใส่ตะกร้า"}
                    </button>
                    <button
                      onClick={() => handleAddToCart(true)}
                      disabled={product.stock <= 0}
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      <CreditCard size={20} />
                      ซื้อเลย
                    </button>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-500">
                   <div className="flex items-center gap-2">
                      <Truck size={18} className="text-green-500" /> จัดส่งฟรีเมื่อซื้อครบ 3,000.-
                   </div>
                   <div className="flex items-center gap-2">
                      <Share2 size={18} className="text-blue-500" /> แชร์
                   </div>
                </div>
              </div>
            </div>
            
            {/* Tabs Section: Description & Specs */}
            <div className="border-t border-gray-200">
               <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">รายละเอียดสินค้า</h3>
                  <div className="prose max-w-none text-gray-600">
                    <p className="whitespace-pre-line">{product.description}</p>
                  </div>

                  {product.specifications && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">สเปคสินค้า</h3>
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 whitespace-pre-line text-gray-700 font-mono text-sm">
                        {product.specifications}
                      </div>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              ความคิดเห็น <span className="text-gray-400 text-lg font-normal">({reviews.length})</span>
            </h2>
            
            {/* Comment Form */}
            <div className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
              {user ? (
                <div className="flex items-start gap-4">
                  <img
                    src={user.pictureUrl || user.picture || "https://placehold.co/100"}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover border border-white shadow-sm"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">{user.username}</p>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={20}
                          className={`cursor-pointer transition-colors ${selectedRating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          onClick={() => setSelectedRating(star)}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{selectedRating > 0 ? `${selectedRating} คะแนน` : "ให้คะแนนสินค้า"}</span>
                    </div>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      rows="3"
                      placeholder="เขียนรีวิวสินค้า..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={handleAddReview}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        ส่งรีวิว
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-2">กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น</p>
                  <Link to="/login" className="text-blue-600 font-medium hover:underline">เข้าสู่ระบบ</Link>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={review.user?.pictureUrl || review.user?.picture || "https://placehold.co/100"}
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-sm text-gray-900">{review.user?.username || "Anonymous"}</p>
                          <div className="flex items-center text-yellow-400 text-xs">
                             {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                             ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {review.review_date ? new Date(review.review_date).toLocaleDateString("th-TH") : "เมื่อสักครู่"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm ml-14">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>ยังไม่มีความคิดเห็น เป็นคนแรกที่รีวิวสินค้านี้!</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Carousel */}
          <div className="mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-blue-600 rounded-full block"></span>
              สินค้าที่คุณอาจสนใจ
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 5).map((item) => (
                <Link to={`/content/${item._id || item.product_id}`} key={item._id || item.product_id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all group">
                   <div className="relative pt-[100%] mb-4 bg-gray-50 rounded-lg overflow-hidden">
                      <img src={item.product_image || item.book_photo} alt={item.product_name} className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
                   </div>
                   <h4 className="font-medium text-gray-900 line-clamp-2 text-sm h-10 mb-2 group-hover:text-blue-600">{item.product_name || item.title}</h4>
                   <p className="text-blue-600 font-bold">฿{item.price?.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Content;