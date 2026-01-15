import http from "../http-common";

// 📌 ฟังก์ชันช่วยสำหรับดึง Token จาก LocalStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return {}; // ถ้าไม่มี token ก็ส่ง header ว่างไป (หรือจะ throw error ก็ได้)
  return { Authorization: `Bearer ${token}` };
};

// 📌 1. ดึงรายการคำสั่งซื้อทั้งหมด (สำหรับ Admin)
// ตรงกับ Backend: router.get('/', controller.getAllOrders);
const getAllOrders = async () => {
  try {
    const response = await http.get("/orders", {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    throw error;
  }
};

// 📌 2. ดูรายละเอียดคำสั่งซื้อรายตัว (By ID)
// ตรงกับ Backend: router.get('/:id', controller.getOrderById);
const getOrderById = async (order_id) => {
  try {
    const response = await http.get(`/orders/${order_id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching order ${order_id}:`, error);
    throw error;
  }
};

// 📌 3. อัปเดตสถานะคำสั่งซื้อ (เช่น ยืนยันการโอน, ส่งของแล้ว)
// ตรงกับ Backend: router.put('/:id/status', controller.updateOrderStatus);
const updateOrderStatus = async (order_id, status) => {
  try {
    const response = await http.put(
      `/orders/${order_id}/status`,
      { status }, // ส่งค่า status ไปใน body
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating order status ${order_id}:`, error);
    throw error;
  }
};

const OrderService = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};

export default OrderService;