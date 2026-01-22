import http from "../http-common";

// ดึงข้อมูลตะกร้า (ต้องส่ง userId ไปท้าย URL)
const getCartItems = (userId) => {
  return http.get(`/carts/${userId}`);
};

// เพิ่มสินค้า (ส่ง user_id, product_id, quantity)
const addToCart = (userId, productId, quantity = 1) => {
  return http.post("/carts/add", {
    user_id: userId,
    product_id: productId,
    quantity: quantity
  });
};

// ลบสินค้า (ส่ง order_item_id)
const removeFromCart = (orderItemId) => {
  return http.delete(`/carts/remove/${orderItemId}`);
};

// แก้ไขจำนวน (ส่ง order_item_id และ quantity ใหม่)
const updateQuantity = (orderItemId, quantity) => {
  return http.put(`/carts/update/${orderItemId}`, { quantity });
};

const CartService = {
  getCartItems,
  addToCart,
  removeFromCart,
  updateQuantity
};

export default CartService;