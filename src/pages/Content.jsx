import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react"; // ✅ เพิ่ม ShoppingCart ตรงนี้
import ProductService from "../Services/Product.service";
import ReadingListService from "../Services/ReadingList.service";
import Layout from "../components/Layout";
import UserService from "../Services/User.service";
import { jwtDecode } from "jwt-decode";
import http from "../http-common";
import CartService from "../Services/Cart.service"; // ✅ Import Service

const Content = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [topBooks, setTopBooks] = useState([]);
  const [currentIndex2, setCurrentIndex2] = useState(0);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
  };

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        console.log("📌 Fetching product data for ID:", id);
        const response = await ProductService.getProductById(id);
        setBook(response.data);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("❌ Error fetching book:", error);
      }
    };

    const fetchTopBooks = async () => {
      try {
        const response = await ProductService.getTopProducts();
        setTopBooks(response.data);
      } catch (error) {
        console.error("❌ Error fetching top books:", error);
      }
    };

    fetchBookData();
    fetchTopBooks();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      fetchUserData(decoded.userId);
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

  // ✅ ฟังก์ชันเพิ่มลงตะกร้า (ส่วนที่เพิ่มใหม่)
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อนซื้อสินค้า!");
        return;
      }
      // เรียกใช้ Service เพิ่มสินค้าลงตะกร้า (จำนวน 1 ชิ้น)
      await CartService.addToCart(id, 1);
      alert("✅ เพิ่มลงตะกร้าเรียบร้อย!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ ไม่สามารถเพิ่มลงตะกร้าได้ (กรุณาลองใหม่)");
    }
  };

  const handleAddToReadingList = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อนเพิ่มหนังสือในคลัง!");
        return;
      }
      console.log("✅ Sending request to add book:", id);
      await ReadingListService.addToReadingList(id);
      alert("✅ เพิ่มลงคลังหนังสือเรียบร้อย!");
    } catch (error) {
      console.error("❌ Error adding to reading list:", error);
      alert("❌ ไม่สามารถเพิ่มลงคลังหนังสือได้!");
    }
  };

  const handleStartReading = async (book_id) => {
    console.log("📌 Start reading for book:", id);
    try {
      const readingListId = await getReadingListId(id);
      if (!readingListId) {
        throw new Error("Reading list entry not found");
      }
      await ReadingListService.startReading(readingListId);
      console.log("✅ เริ่มอ่านหนังสือเรียบร้อย!");
    } catch (error) {}
  };

  const getReadingListId = async (book_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const decoded = jwtDecode(token);
      const user_id = decoded.userId;
      if (!user_id || !book_id) throw new Error("Invalid user_id or book_id");

      const response = await http.get(`/readings/find/by-user-and-book`, {
        params: { user_id, book_id },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data || !response.data.reading_id)
        throw new Error("Reading list entry not found");
      return response.data.reading_id;
    } catch (error) {
      console.error(
        "❌ Error fetching reading list ID:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user || !user.user_id) {
      alert("กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น");
      return;
    }
    if (!newComment.trim()) {
      alert("กรุณาพิมพ์ข้อความก่อนส่งความคิดเห็น");
      return;
    }
    if (selectedRating === 0) {
      alert("กรุณาให้คะแนนก่อนส่งความคิดเห็น");
      return;
    }

    try {
      const response = await ProductService.addReview(
        id,
        user.user_id,
        selectedRating,
        newComment
      );

      if (response && response.review && response.book) {
        const { review, book } = response;
        if (!review.user) {
          review.user = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            picture: user.pictureUrl,
          };
        }
        setReviews((prevReviews) => [...prevReviews, review]);
        setBook((prevBook) => ({
          ...prevBook,
          review_count: book.review_count,
          average_rating: book.average_rating,
        }));
      }
    } catch (error) {
      console.error("❌ Error adding review:", error);
      alert("เกิดข้อผิดพลาดในการส่งความคิดเห็น กรุณาลองใหม่");
    } finally {
      setNewComment("");
      setSelectedRating(0);
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="min-h-screen flex flex-col space-y-9 justify-center items-center p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row max-w-4xl w-full">
          <img
            src={book.book_photo || book.product_photo}
            alt={book.title}
            className="w-full md:w-1/3 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
            <p className="text-lg font-semibold mb-1">โดย {book.author}</p>
            <p className="text-gray-700 mb-4">{book.description}</p>

            {/* ส่วนปุ่มกด */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mt-4 flex-wrap">
              {/* ✅ ปุ่มเพิ่มลงตะกร้า (ใหม่) */}
              <button
                onClick={handleAddToCart}
                className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-6 py-2 rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <ShoppingCart size={20} /> เพิ่มลงตะกร้า
              </button>

              <button
                onClick={handleAddToReadingList}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-2 rounded-lg shadow-md transition-all w-full md:w-auto"
              >
                เพิ่มลงคลังหนังสือ
              </button>
              
              {book.html_content && (
                <a
                  href={book.html_content}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleStartReading(id)}
                  className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-2 rounded-lg shadow-md transition-all w-full md:w-auto text-center"
                >
                  อ่านหนังสือ
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Top Books Section */}
        <div className="relative overflow-hidden w-full px-4 mt-10">
          <h1 className="text-3xl font-bold ml-5 mb-4">
            🔥 หนังสือยอดนิยม ตลอดกาล
          </h1>
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${(currentIndex2 * 100) / 5}%)` }}
          >
            {topBooks.map((topBook) => (
              <div key={topBook._id} className="w-1/5 flex-none p-2">
                <Link to={`/content/${topBook._id}`}>
                  <div className="bg-white p-3 rounded-lg shadow-lg w-auto mb-5 flex flex-col justify-between h-[500px]">
                    <img
                      src={topBook.book_photo}
                      alt={topBook.title}
                      className="w-80 h-[450px] object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg font-semibold text-center min-h-[48px] flex items-center justify-center">
                      {topBook.title}
                    </h3>
                    <p className="text-sm text-center text-gray-500 h-10">
                      {topBook.categories?.[0]?.name || "ไม่มีหมวดหมู่"}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {currentIndex2 < 5 && (
            <button
              onClick={() =>
                setCurrentIndex2((prevIndex) => Math.max(prevIndex + 5, 0))
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
            >
              <ChevronRight size={44} />
            </button>
          )}
          {currentIndex2 > 0 && (
            <button
              onClick={() =>
                setCurrentIndex2((prevIndex) => Math.max(prevIndex - 5, 0))
              }
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
            >
              <ChevronLeft size={44} />
            </button>
          )}
        </div>

        {/* Review Section */}
        <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">ความคิดเห็น</h2>
          {user ? (
            <div className="flex items-start space-x-4 mb-6">
              <img
                src={user.pictureUrl}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-bold">{user.username}</p>
                <div className="flex items-center space-x-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer ${
                        selectedRating >= star
                          ? "text-yellow-500 "
                          : "text-gray-400"
                      }`}
                      onClick={() => handleRatingSelect(star)}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold">
                    {selectedRating}.0
                  </span>
                </div>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows="2"
                  placeholder="แสดงความคิดเห็น..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  onClick={handleAddReview}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
                >
                  ส่งความคิดเห็น
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น
            </p>
          )}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.review_id}
                  className="bg-gray-100 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img
                        src={review.user.pictureUrl}
                        alt={review.user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-bold">{review.user.username}</p>
                        <p className="text-gray-500 text-sm">
                          {new Date(review.review_date).toLocaleString("th-TH")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">ยังไม่มีความคิดเห็น</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Content;