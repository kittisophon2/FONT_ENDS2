import http from "../http-common";

const getAllCategories = () => {
  // ✅ แก้ไข: ยิงไปที่ /categories
  return http.get("/categories");
};

const getCategoryById = (id) => {
  return http.get(`/categories/${id}`);
};

const CategoryService = {
  getAllCategories,
  getCategories: getAllCategories, // Alias กัน Error
  getCategoryById
};

export default CategoryService;