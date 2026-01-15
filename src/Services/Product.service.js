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

// ดึงสินค้าตามหมวดหมู่ (เพิ่มฟังก์ชันนี้เพื่อให้หน้า Products.jsx ใช้งานได้)
const getProductsByCategory = (categoryId) => {
  // หมายเหตุ: คุณต้องเช็คว่า Backend มี route นี้หรือไม่ ถ้าไม่มีอาจต้องใช้ Search หรือ Filter
  // สมมติว่าใช้ path นี้:
  return http.get(`/categories/${categoryId}/products`); 
  // หรือถ้า backend ใช้ search: return http.get(`/products/search/_/${categoryId}`);
};

const addReview = (product_id, user_id, rating = 5, comment) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No authentication token found!");
    return Promise.reject(new Error("Unauthorized: No token provided"));
  }

  return http
    .post(
      "/products/add-review",
      { product_id, user_id, rating, comment }, // เปลี่ยน key เป็น product_id (ต้องตรงกับ backend)
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      console.log("📌 API Raw Response:", response);
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