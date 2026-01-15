import http from "../http-common";
import { jwtDecode } from "jwt-decode";

// ฟังก์ชันช่วยดึง Header พร้อม Token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded.userId;
};

// 1. ดึงสินค้าในตะกร้าของผู้ใช้
const getCartItems = async () => {
  const userId = getUserId();
  if (!userId) throw new Error("User not logged in");
  
  // ปรับ path ให้ตรงกับ Backend ของคุณ (เช่น /cart หรือ /cart/:userId)
  return http.get(`/cart/${userId}`, { headers: getAuthHeaders() });
};

// 2. เพิ่มสินค้าลงตะกร้า
const addToCart = async (product_id, quantity = 1) => {
  const userId = getUserId();
  if (!userId) throw new Error("User not logged in");

  return http.post(
    "/cart", 
    { user_id: userId, product_id, quantity }, 
    { headers: getAuthHeaders() }
  );
};

// 3. ลบสินค้าออกจากตะกร้า
const removeFromCart = async (cart_item_id) => {
  return http.delete(`/cart/${cart_item_id}`, { headers: getAuthHeaders() });
};

// 4. สั่งซื้อสินค้า (Checkout) - เปลี่ยนสถานะจาก Cart เป็น Order
const checkout = async () => {
  const userId = getUserId();
  return http.post("/orders/checkout", { user_id: userId }, { headers: getAuthHeaders() });
};

const CartService = {
  getCartItems,
  addToCart,
  removeFromCart,
  checkout
};

export default CartService;