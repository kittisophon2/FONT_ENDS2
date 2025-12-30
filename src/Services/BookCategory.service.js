import http from "../http-common";

const getCategoriesByBookId = (book_id) => {
  return http.get(`/bookcategories/book/${book_id}/categories`);
};

const getBooksByCategory = (category_id) => {
  return http.get(`/bookcategories/category/${category_id}`);
}

const BookCategoryService = {
  getCategoriesByBookId,getBooksByCategory,  // ใช้ book_id เพื่อดึง category_name
};

export default BookCategoryService;