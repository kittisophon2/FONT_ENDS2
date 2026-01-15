import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductService from "../Services/Product.service"; // เปลี่ยน import
import Layout from "../components/Layout";
import Slideshow from "../components/Slideshow";
import ReviewService from "../Services/Review.service";

const Home = () => { // เปลี่ยนชื่อ Component ให้สื่อความหมาย (หรือใช้ BookList เหมือนเดิมก็ได้)
  const [products, setProducts] = useState([]); // books -> products
  const [topProducts, setTopProducts] = useState([]); // topBooks -> topProducts
  const [topRatingProducts, setTopRatingProducts] = useState([]); // avBooks -> topRatingProducts
  const [reviews, setReviews] = useState([]); // Review -> reviews (ตั้งชื่อตัวแปรให้เป็นพหูพจน์)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);

  useEffect(() => {
    // โหลดสินค้าทั้งหมด
    ProductService.getProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((e) => console.log(e));

    // โหลดสินค้ายอดนิยม
    ProductService.getTopProducts(10)
      .then((response) => {
        setTopProducts(response.data);
      })
      .catch((e) => console.log(e));

    // โหลดสินค้าเรตติ้งดี
    ProductService.getTopRatingProducts(10)
      .then((response) => {
        setTopRatingProducts(response.data);
      })
      .catch((e) => console.log(e));

    // โหลดรีวิว
    ReviewService.getReview(10)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((e) => console.log(e));
  }, []);

  // ฟังก์ชันแสดงหมวดหมู่ (สมมติว่า product มี field category อยู่แล้ว)
  const getCategoryName = (product) => {
    if (!product.category) return "ไม่ระบุหมวดหมู่";
    return Array.isArray(product.category)
      ? product.category.join(", ")
      : product.category;
  };

  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 5, 0));
  const nextSlide = () => setCurrentIndex((prev) => Math.max(prev + 5, 0));
  const prevSlide2 = () => setCurrentIndex2((prev) => Math.max(prev - 5, 0));
  const nextSlide2 = () => setCurrentIndex2((prev) => Math.max(prev + 5, 0));

  return (
    <Layout>
      <Slideshow />
      <div className="relative w-full overflow-hidden">
        <img src="/bg/bgtree.gif" alt="Background" className="absolute top-0 left-0 w-full h-40 object-cover" />
        <div className="relative flex justify-center items-center w-full h-40 bg-black bg-opacity-50">
          <h1 className="text-6xl text-white logo">Welcome To BookTree</h1>
        </div>
      </div>

      <div className="p-6">
        {/* สินค้าใหม่ */}
        <div className="relative overflow-hidden w-full px-4">
          <h1 className="text-3xl font-bold ml-5 mb-4">📚 สินค้าใหม่ รายสัปดาห์</h1>
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${(currentIndex * 100) / 5}%)` }}>
            {products.map((product) => (
              <div key={product._id} className="w-1/5 flex-none p-2">
                <Link to={`/content/${product._id}`}>
                  <div className="bg-white p-3 rounded-lg shadow-lg w-auto mb-5 flex flex-col justify-between h-[500px]">
                    <img
                      src={product.book_photo || product.product_photo} // เช็คชื่อ field รูปภาพใน DB
                      alt={product.title}
                      className="w-80 h-[450px] object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg font-semibold text-center min-h-[48px] flex items-center justify-center">
                      {product.title}
                    </h3>
                    <p className="text-sm text-center text-gray-500 h-10">
                      {getCategoryName(product)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {/* Controls omitted for brevity, use same logic as before */}
           {currentIndex + 5 < products.length && (
            <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full"><ChevronRight size={44} /></button>
          )}
          {currentIndex > 0 && (
            <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full"><ChevronLeft size={44} /></button>
          )}
        </div>

        {/* สินค้ายอดนิยม */}
        <div className="relative overflow-hidden w-full px-4 mt-10">
          <h1 className="text-3xl font-bold ml-5 mb-4">🔥 สินค้ายอดนิยม ตลอดกาล</h1>
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${(currentIndex2 * 100) / 5}%)` }}>
            {topProducts.map((product) => (
              <div key={product._id} className="w-1/5 flex-none p-2">
                <Link to={`/content/${product._id}`}>
                  <div className="bg-white p-3 rounded-lg shadow-lg flex flex-col justify-between h-[500px]">
                    <img
                       src={product.book_photo || product.product_photo}
                      alt={product.title}
                      className="w-80 h-[450px] object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg font-semibold text-center min-h-[48px] flex items-center justify-center">
                      {product.title}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
           {currentIndex2 < 5 && (
            <button onClick={nextSlide2} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full"><ChevronRight size={44} /></button>
          )}
          {currentIndex2 > 0 && (
            <button onClick={prevSlide2} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full"><ChevronLeft size={44} /></button>
          )}
        </div>
      </div>

      {/* จัดอันดับ */}
      <div className="w-full px-4 mt-10 pb-20">
        <h1 className="text-3xl font-bold ml-10 mb-6 text-gray-800">🏆 จัดอันดับสินค้า/ผู้ใช้งาน</h1>
        <div className="grid grid-cols-3 gap-6">
          
          {/* Top Products List */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col min-h-[450px]">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-700">📖 สินค้ายอดนิยม</h2>
            <div className="space-y-4 flex-grow">
              {topProducts.slice(0, 5).map((product, index) => (
                <Link to={`/content/${product._id}`} key={product._id}>
                  <div className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <span className="text-lg font-semibold text-gray-700">#{index + 1}</span>
                    <img src={product.book_photo || product.product_photo} alt={product.title} className="w-14 h-20 object-cover rounded-md shadow-md" />
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">{product.title}</h3>
                      <p className="text-gray-600 text-sm">{product.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Reviewers */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col min-h-[450px]">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-700">👨‍💻 นักรีวิวที่มีส่วนร่วมมากที่สุด</h2>
            <div className="space-y-4 flex-grow">
              {reviews.slice(0, 5).map((review, index) => (
                <div key={review.user_id} className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <span className="text-lg font-semibold text-gray-700">#{index + 1}</span>
                  <img src={review.pictureUrl} alt={review.username} className="w-14 h-20 object-cover rounded-md shadow-md" />
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">{review.username}</h3>
                    <p className="text-gray-600 text-sm">รีวิว {review.review_count} ครั้ง</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Products */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col min-h-[450px]">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-700">⭐ สินค้าคะแนนสูงสุด</h2>
            <div className="space-y-4 flex-grow">
              {topRatingProducts.slice(0, 5).map((product, index) => (
                <Link to={`/content/${product._id}`} key={product._id}>
                  <div className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <span className="text-lg font-semibold text-gray-700">#{index + 1}</span>
                    <img src={product.book_photo || product.product_photo} alt={product.title} className="w-14 h-20 object-cover rounded-md shadow-md" />
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">{product.title}</h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <p className="text-gray-600 text-sm font-semibold">{product.averageRating}</p>
                        <span className="text-gray-400 text-sm">({product.totalReviews} รีวิว)</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Home;