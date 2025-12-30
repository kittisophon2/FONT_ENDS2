import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookService from "../Services/Book.service";
import BookCategoryService from "../Services/BookCategory.service";
import Layout from "../components/Layout";
import Slideshow from "../components/Slideshow";
import ReviewService from "../Services/Review.service";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [bookCategories, setBookCategories] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [avBooks, setavBooks] = useState([]);
  const [Review, setReview] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);

  useEffect(() => {
    // โหลดหนังสือทั้งหมด
    BookService.getBooks()
      .then((response) => {
        setBooks(response.data);
      })
      .catch((e) => console.log(e));

    // โหลดหนังสือยอดนิยม
    BookService.getTopBooks(10)
      .then((response) => {
        setTopBooks(response.data);
      })
      .catch((e) => console.log(e));

    BookService.getavBooks(10)
      .then((response) => {
        setavBooks(response.data);
      })
      .catch((e) => console.log(e));

    ReviewService.getReview(10)
      .then((response) => {
        setReview(response.data);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (books.length === 0) return;

    const categoryRequests = books.map((book) =>
      BookCategoryService.getCategoriesByBookId(book._id)
    );

    Promise.all(categoryRequests)
      .then((categoryResponses) => {
        const categories = categoryResponses.map((res, index) => ({
          book_id: books[index]._id,
          category:
            res.data.categories.length > 0
              ? res.data.categories
              : ["ไม่ระบุหมวดหมู่"],
        }));
        setBookCategories(categories);
      })
      .catch((e) => console.log("Error loading categories:", e));
  }, [books]);

  const getCategoryName = (bookId) => {
    const bookCategory = bookCategories.find((bc) => bc.book_id === bookId);

    if (!bookCategory || !bookCategory.category) return "ไม่ระบุหมวดหมู่";

    // ถ้า category เป็น array ให้แสดงผลเป็นข้อความ เช่น "Fantasy, Adventure"
    return Array.isArray(bookCategory.category)
      ? bookCategory.category.join(", ")
      : bookCategory.category;
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 5, 0));
  };

  const prevSlide2 = () => {
    setCurrentIndex2((prevIndex) => Math.max(prevIndex - 5, 0));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex + 5, 0));
  };

  const nextSlide2 = () => {
    setCurrentIndex2((prevIndex) => Math.max(prevIndex + 5, 0));
  };

  return (
    <Layout>
      <Slideshow />
      <div className="relative w-full overflow-hidden">
        <img
          src="/bg/bgtree.gif"
          alt="Background Animation"
          className="absolute top-0 left-0 w-full h-40 object-cover"
        />
        <div className="relative flex justify-center items-center w-full h-40 bg-black bg-opacity-50">
          <h1 className="text-6xl text-white logo">Welcome To BookTree</h1>
        </div>
      </div>

      <div className=" p-6">
        {/* หนังสือใหม่ รายสัปดาห์ */}
        <div className="relative overflow-hidden w-full px-4">
          <h1 className="text-3xl font-bold ml-5 mb-4">
            📚 หนังสือใหม่ รายสัปดาห์
          </h1>
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${(currentIndex * 100) / 5}%)` }}
          >
            {books.map((book) => (
              <div key={book._id} className="w-1/5 flex-none p-2">
                <Link to={`/content/${book._id}`}>
                  <div className="bg-white p-3 rounded-lg shadow-lg w-auto mb-5 flex flex-col justify-between h-[500px]">
                    <img
                      src={`${book.book_photo}`}
                      alt={book.title}
                      className="w-80 h-[4500] object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg font-semibold text-center min-h-[48px] flex items-center justify-center">
                      {book.title}
                    </h3>
                    <p className="text-sm text-center text-gray-500 h-10">
                      {getCategoryName(book._id)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {currentIndex + 5 < books.length && (
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
            >
              <ChevronRight size={44} />
            </button>
          )}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
            >
              <ChevronLeft size={44} />
            </button>
          )}
        </div>

        {/* หนังสือยอดนิยม ตลอดกาล */}
        <div className="relative overflow-hidden w-full px-4 mt-10">
          <h1 className="text-3xl font-bold ml-5 mb-4">
            🔥 หนังสือยอดนิยม ตลอดกาล
          </h1>
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${(currentIndex2 * 100) / 5}%)` }}
          >
            {topBooks.map((book) => (
              <div key={book._id} className="w-1/5 flex-none p-2">
                <Link to={`/content/${book._id}`}>
                  <div className="bg-white p-3 rounded-lg shadow-lg w-auto mb-5 flex flex-col justify-between h-[500px]">
                    <img
                      src={`${book.book_photo}`}
                      alt={book.title}
                      className="w-80 h-[4500] object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg font-semibold text-center min-h-[48px] flex items-center justify-center">
                      {book.title}
                    </h3>
                    <p className="text-sm text-center text-gray-500 h-10">
                      {getCategoryName(book._id)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {currentIndex2 < 5 && ( // ปุ่มหายไปเมื่อถึงหน้าที่สอง (index 5)
            <button
              onClick={nextSlide2}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
            >
              <ChevronRight size={44} />
            </button>
          )}
          {currentIndex2 > 0 && (
            <button
              onClick={prevSlide2}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
            >
              <ChevronLeft size={44} />
            </button>
          )}
        </div>
      </div>

      {/* จัดอันดับหนังสือ/นักอ่าน */}
      <div className="w-full px-4 mt-10 pb-20">
        <h1 className="text-3xl font-bold ml-10 mb-6 text-gray-800 ">
          🏆 จัดอันดับหนังสือ/นักอ่าน
        </h1>

        <div className="grid grid-cols-3 gap-6">
          {/* หนังสือยอดนิยม */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col min-h-[450px]">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-700">
              📖 หนังสือยอดนิยม
            </h2>
            <div className="space-y-4 flex-grow">
              {topBooks.slice(0, 5).map((book, index) => (
                <Link to={`/content/${book._id}`} key={book._id}>
                  <div className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <span className="text-lg font-semibold text-gray-700">
                      #{index + 1}
                    </span>
                    <img
                      src={book.book_photo}
                      alt={book.title}
                      className="w-14 h-20 object-cover rounded-md shadow-md"
                    />
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{book.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* หนังสือยอดนิยม */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col min-h-[450px]">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-700">
              👨‍💻 นักอ่านที่มีส่วนร่วมมากที่สุด
            </h2>
            <div className="space-y-4 flex-grow">
              {Review.slice(0, 5).map((Review, index) => (
                <Link to={``} key={Review.user_id}>
                  <div className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <span className="text-lg font-semibold text-gray-700">
                      #{index + 1}
                    </span>
                    <img
                      src={Review.pictureUrl}
                      alt={Review.username}
                      className="w-14 h-20 object-cover rounded-md shadow-md"
                    />
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">
                        {Review.username}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        แสดงความคิดเห็น {Review.review_count} ครั้ง
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* หนังสือยอดนิยม */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col min-h-[450px]">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-700">
              ⭐ หนังสือที่ได้คะแนนมากที่สุด
            </h2>
            <div className="space-y-4 flex-grow">
              {avBooks.slice(0, 5).map((book, index) => (
                <Link to={`/content/${book._id}`} key={book._id}>
                  <div className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <span className="text-lg font-semibold text-gray-700">
                      #{index + 1}
                    </span>
                    <img
                      src={book.book_photo}
                      alt={book.title}
                      className="w-14 h-20 object-cover rounded-md shadow-md"
                    />
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{book.author}</p>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <p className="text-gray-600 text-sm font-semibold">
                          {book.averageRating}
                        </p>
                        <span className="text-gray-400 text-sm">
                          ({book.totalReviews} รีวิว)
                        </span>
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

export default BookList;
