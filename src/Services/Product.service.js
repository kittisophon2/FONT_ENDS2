import http from "../http-common";

// ดึงสินค้าทั้งหมด
const getAllProducts = () => {
  return http.get("/products");
};

const getTopProducts = (limit = 10) => {
  return http.get(`/products/top-products/top`);
};

const getTopRatingProducts = (limit = 10) => {
  return http.get(`/products/top-products/toprating`);
};

const getProductById = (id) => {
  return http.get(`/products/${id}`);
};

// ✅ แก้ไข: ยิงไปที่ /categories/:id (Backend จะส่งข้อมูลหมวดหมู่พร้อมสินค้าในนั้นกลับมา)
const getProductsByCategory = (categoryId) => {
  return http.get(`/categories/${categoryId}`); 
};

const addReview = (product_id, user_id, rating = 5, comment) => {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject(new Error("Unauthorized"));

  return http.post("/reviews/add-review", 
    { product_id, user_id, rating, comment }, 
    { headers: { Authorization: `Bearer ${token}` } }
  ).then(res => res.data);
};

// --- Admin Functions ---
const createProduct = (data) => {
  return http.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
};
const updateProduct = (id, data) => {
  return http.put(`/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
};
const deleteProduct = (id) => {
  return http.delete(`/products/${id}`);
};

const ProductService = {
  getAllProducts,
  getProducts: getAllProducts,
  getTopProducts,
  getTopRatingProducts,
  getProductById,
  getProductsByCategory,
  addReview,
  createProduct,
  updateProduct,
  deleteProduct
};

export default ProductService;