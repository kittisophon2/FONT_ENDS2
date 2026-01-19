import http from "../http-common";

// ดึงสินค้าทั้งหมด
const getProducts = () => {
  return http.get("/products");
};

// ดึงสินค้า Top (เช่น 10 อันดับแรก)
const getTopProducts = (limit = 10) => {
  return http.get(`/products/top-products/top`);
};

// ดึงสินค้าที่เรตติ้งสูงสุด
const getTopRatingProducts = (limit = 10) => {
  return http.get(`/products/top-products/toprating`);
};

// ดึงสินค้าตาม ID
const getProductById = (id) => {
  return http.get(`/products/${id}`);
};

// ✅ แก้ไขส่วนนี้: ดึงสินค้าตามหมวดหมู่
const getProductsByCategory = (categoryId) => {
  // เรียกไปที่ path /categories/:id ตรงๆ 
  // เพราะ Backend (Category Controller) ได้ถูกแก้ให้ส่งข้อมูล products กลับมาพร้อมกับ category แล้ว
  return http.get(`/categories/${categoryId}`); 
};

const addReview = (product_id, user_id, rating = 5, comment) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No authentication token found!");
    return Promise.reject(new Error("Unauthorized: No token provided"));
  }

  return http
    .post(
      "/reviews/add", // หรือ "/products/add-review" ตาม Route ที่คุณตั้งไว้ใน Backend (ตรวจสอบ route/review.route.js หรือ product.route.js)
      { product_id, user_id, rating, comment }, 
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error submitting review:", error);
      throw error;
    });
};

const ProductService = {
  getProducts,
  getTopProducts,
  getTopRatingProducts,
  getProductById,
  getProductsByCategory,
  addReview,
};

export default ProductService;