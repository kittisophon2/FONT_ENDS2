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
  try {
    const decoded = jwtDecode(token);
    // ✅ แก้ไข: เช็คทั้ง userId และ user_id กันพลาด
    return decoded.userId || decoded.user_id;
  } catch (error) {
    return null;
  }
};

// 1. ดึงสินค้าในตะกร้าของผู้ใช้
const getCartItems = async () => {
  const userId = getUserId();
  if (!userId) throw new Error("User not logged in");
  
  // เรียก API ไปที่ /carts/:user_id
  return http.get(`/carts/${userId}`, { headers: getAuthHeaders() });
};

// 2. เพิ่มสินค้าลงตะกร้า
const addToCart = async (product_id, quantity = 1) => {
  const userId = getUserId();
  if (!userId) {
    console.error("User ID not found in token");
    throw new Error("User not logged in");
  }

  // เรียก API ไปที่ /carts/add
  return http.post(
    "/carts/add", 
    { user_id: userId, product_id, quantity }, 
    { headers: getAuthHeaders() }
  );
};

// 3. ลบสินค้าออกจากตะกร้า
const removeFromCart = async (cart_item_id) => {
  // เรียก API ไปที่ /carts/remove/:item_id
  return http.delete(`/carts/remove/${cart_item_id}`, { headers: getAuthHeaders() });
};

// 4. สั่งซื้อสินค้า (Checkout)
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