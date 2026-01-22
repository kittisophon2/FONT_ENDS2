import http from "../http-common";
import { jwtDecode } from "jwt-decode";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.userId || decoded.user_id;
  } catch (error) {
    return null;
  }
};

const getCartItems = async () => {
  const userId = getUserId();
  // ถ้าไม่มี user login ให้ส่งค่าว่างกลับไปเลย (ไม่ error 404)
  if (!userId) return { data: [] }; 
  
  return http.get(`/carts/${userId}`, { headers: getAuthHeaders() });
};

const addToCart = async (product_id, quantity = 1) => {
  const userId = getUserId();
  if (!userId) throw new Error("กรุณาเข้าสู่ระบบ");
  return http.post("/carts/add", { user_id: userId, product_id, quantity }, { headers: getAuthHeaders() });
};

const removeFromCart = async (cart_item_id) => {
  return http.delete(`/carts/remove/${cart_item_id}`, { headers: getAuthHeaders() });
};

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