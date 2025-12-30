import React, { useEffect, useState } from "react";
import { Trash2, CheckCircle } from "lucide-react"; // เพิ่มไอคอน CheckCircle ✅
import Layout from "../components/Layout";
import ReadingListService from "../Services/ReadingList.service";
import { Link } from "react-router-dom";

const Treasury = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await ReadingListService.getUserReadingList();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleRemove = async (reading_id) => {
    if (!window.confirm("คุณต้องการลบหนังสือเล่มนี้ออกจากคลังใช่ไหม?")) return;

    try {
      await ReadingListService.removeFromReadingList(reading_id);
      setBooks((prevBooks) => prevBooks.filter((book) => book.reading_id !== reading_id));
    } catch (error) {
      alert("❌ ลบไม่สำเร็จ: " + error.message);
    }
  };

  // ✅ ฟังก์ชันกด "อ่านแล้ว"
  const handleFinishReading = async (reading_id) => {
    if (!window.confirm("คุณอ่านหนังสือเล่มนี้จบแล้วใช่ไหม?")) return;

    try {
      await ReadingListService.finishReading(reading_id);
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.reading_id === reading_id ? { ...book, status: "อ่านแล้ว ✅" } : book
        )
      );
    } catch (error) {
      alert("❌ ไม่สามารถอัปเดตสถานะได้: " + error.message);
    }
  };

  return (
    <Layout>
      <div className="p-10 h-full justify-center items-center flex">
        <div className="p-10 bg-white rounded-2xl w-full max-w-2xl">
          <h1 className="text-3xl font-semibold mb-4">📚 คลังหนังสือ</h1>
          {loading ? (
            <p>กำลังโหลด...</p>
          ) : error ? (
            <p className="text-red-500">❌ {error}</p>
          ) : books.length === 0 ? (
            <p>ไม่มีหนังสือในคลัง</p>
          ) : (
            <ul className="space-y-4">
              {books.map((book) => (
                <li key={book.reading_id} className="relative">
                  <Link to={`/content/${book.book.book_id}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row max-w-4xl w-full">
                      <img
                        src={book.book.book_photo}
                        alt={book.book.title}
                        className="w-full md:w-1/3 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
                      />
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-2">{book.book.title}</h1>
                        <p className="text-lg font-semibold mb-1">โดย {book.book.author}</p>
                        <p className="text-gray-700 mb-4">{book.book.description}</p>
                        <p className={`mb-4 font-semibold ${book.status === "อ่านแล้ว ✅" ? "text-green-600" : "text-gray-600"}`}>
                          สถานะ: {book.status}
                        </p>
                      </div>
                    </div>
                  </Link>
                  {/* ✅ ปุ่มอ่านแล้ว */}
                  {book.status !== "อ่านแล้ว ✅" && (
                    <button
                      className="absolute bottom-14 right-3 bg-green-500 text-white rounded-full p-2 shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110"
                      onClick={() => handleFinishReading(book.reading_id)}
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                  {/* 🗑️ ปุ่มลบ */}
                  <button
                    className="absolute bottom-3 right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-700 transition-transform transform hover:scale-110"
                    onClick={() => handleRemove(book.reading_id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Treasury;
