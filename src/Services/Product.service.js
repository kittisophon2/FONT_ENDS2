import http from "../http-common";

// --- Public Functions ---

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

// ดึงสินค้าตามหมวดหมู่
const getProductsByCategory = (categoryId) => {
  return http.get(`/categories/${categoryId}`); 
};

// เพิ่มรีวิว (Manual Token)
const addReview = (product_id, user_id, rating = 5, comment) => {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject(new Error("Unauthorized"));

  return http.post("/reviews/add-review", 
    { product_id, user_id, rating, comment }, 
    { headers: { Authorization: `Bearer ${token}` } }
  ).then(res => res.data);
};

// --- Admin Functions (แก้ไข: ฝัง Token แบบ Explicit เพื่อกัน Error 401) ---

const createProduct = (data) => {
  const token = localStorage.getItem("token");
  return http.post("/products", data, { 
    headers: { 
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}` // ✅ ใส่ Token ตรงนี้ให้ชัวร์
    } 
  });
};

const updateProduct = (id, data) => {
  const token = localStorage.getItem("token");
  return http.put(`/products/${id}`, data, { 
    headers: { 
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}` // ✅ ใส่ Token ตรงนี้ให้ชัวร์
    } 
  });
};

const deleteProduct = (id) => {
  const token = localStorage.getItem("token");
  return http.delete(`/products/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}` // ✅ ใส่ Token ตรงนี้ให้ชัวร์
    }
  });
};

const ProductService = {
  getAllProducts,
  getProducts: getAllProducts, // Alias
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