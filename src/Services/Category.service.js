import http from "../http-common";

// ดึงหมวดหมู่ทั้งหมด
const getAllCategories = () => {
  return http.get("/categories");
};

const getCategoryById = (id) => {
  return http.get(`/categories/${id}`);
};

// ✅ เพิ่มฟังก์ชันสำหรับ Admin (Create, Update, Delete)

const createCategory = (data) => {
  const token = localStorage.getItem("token");
  return http.post("/categories", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const updateCategory = (id, data) => {
  const token = localStorage.getItem("token");
  return http.put(`/categories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const deleteCategory = (id) => {
  const token = localStorage.getItem("token");
  return http.delete(`/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const CategoryService = {
  getAllCategories,
  getCategories: getAllCategories, // Alias
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};

export default CategoryService;