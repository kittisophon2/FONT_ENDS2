import http from "../http-common";

const getBooks = () => {
  return http.get("/books");
};

const getTopBooks = () => {
  return http.get(`/books/top-books/top`);
};

const getavBooks = () => {
  return http.get(`/books/top-books/toprating`);
};

const getBookById = (book_id) => {
  return http.get(`/books/${book_id}`);
};


const addReview = (book_id, user_id, rating = 5, comment) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No authentication token found!");
    return Promise.reject(new Error("Unauthorized: No token provided"));
  }

  return http
    .post(
      "/books/add-review",
      { book_id, user_id, rating, comment },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      console.log("📌 API Raw Response:", response); // ✅ เพิ่ม log เพื่อตรวจสอบโครงสร้าง response
      return response.data; // ✅ ส่งเฉพาะข้อมูล data
    })
    .catch((error) => {
      console.error("Error submitting review:", error);
      throw error;
    });
};



const BookService = {
  getBooks,
  getTopBooks,
  getBookById,
  addReview,
  getavBooks, 
};

export default BookService;