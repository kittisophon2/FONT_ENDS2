import http from "../http-common";

// ดึงข้อมูลตะกร้า
const getCartItems = (userId) => {
  return http.get(`/carts/${userId}`);
};

// เพิ่มสินค้า (ส่ง user_id และ product_id)
const addToCart = (userId, productId, quantity = 1) => {
  // Debug: ดูค่าที่ส่งไปก่อนยิง API
  console.log("🚀 Sending to Backend:", { user_id: userId, product_id: productId, quantity }); 
  
  return http.post("/carts/add", {
    user_id: userId,
    product_id: productId, // ต้องเป็น String รหัสยาวๆ (เช่น "696b...") ห้ามเป็นเลข 1
    quantity: quantity
  });
};

// ลบสินค้า
const removeFromCart = (orderItemId) => {
  return http.delete(`/carts/remove/${orderItemId}`);
};

// แก้ไขจำนวน
const updateQuantity = (orderItemId, quantity) => {
  return http.put(`/carts/update/${orderItemId}`, { quantity });
};

// สั่งซื้อ (Checkout)
const checkout = (userId) => {
  return http.post("/orders/checkout", { user_id: userId });
};

const CartService = {
  getCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  checkout
};

export default CartService;