import http from "../http-common";

// จัดการสินค้า (ใช้ ProductService เดิมได้ หรือจะรวมที่นี่ก็ได้)
const getAllProducts = () => http.get("/products");
const deleteProduct = (id) => http.delete(`/products/${id}`);

// จัดการคำสั่งซื้อ (ต้องมี API รองรับ)
const getAllOrders = () => http.get("/orders"); // Backend ต้องมี route นี้
const updateOrderStatus = (orderId, status) => http.put(`/orders/${orderId}`, { status });

// จัดการผู้ใช้งาน
const getAllUsers = () => http.get("/users"); // Backend ต้องมี route นี้

// ดูสถิติ (ถ้า Backend ไม่มี API นี้ อาจต้องดึง Order มาคำนวณเองหน้าบ้าน)
const getStats = () => http.get("/stats"); 

const AdminService = {
  getAllProducts,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getStats
};

export default AdminService;