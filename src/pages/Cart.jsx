import React, { useEffect, useState } from "react";
import CartService from "../Services/Cart.service";
import Layout from "../components/Layout";
import { Trash2 } from "lucide-react"; // ไอคอนถังขยะ
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  // โหลดข้อมูลตะกร้า
  const fetchCart = async () => {
    try {
      const response = await CartService.getCartItems();
      setCartItems(response.data);
      calculateTotal(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // คำนวณราคารวม
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    setTotalPrice(total);
  };

  // ลบสินค้า
  const handleRemove = async (itemId) => {
    if (confirm("ต้องการลบสินค้านี้ใช่ไหม?")) {
      try {
        await CartService.removeFromCart(itemId);
        fetchCart(); // โหลดข้อมูลใหม่
      } catch (error) {
        alert("ลบสินค้าไม่สำเร็จ");
      }
    }
  };

  // กดสั่งซื้อ
  const handleCheckout = async () => {
    try {
      await CartService.checkout();
      alert("สั่งซื้อสำเร็จ!");
      navigate("/"); // กลับหน้าแรก หรือไปหน้าประวัติการสั่งซื้อ
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">🛒 ตะกร้าสินค้าของฉัน</h1>
        
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">ไม่มีสินค้าในตะกร้า</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cart_id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={`http://localhost:4000/images/${item.product.product_image}`} 
                      alt={item.product.title} 
                      className="w-20 h-28 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{item.product.title}</h3>
                      <p className="text-gray-600">ราคา: {item.product.price} บาท</p>
                      <p className="text-sm text-gray-500">จำนวน: {item.quantity}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemove(item.cart_id)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center pt-4 border-t">
              <h2 className="text-2xl font-bold">ราคารวมทั้งหมด: {totalPrice.toLocaleString()} บาท</h2>
              <button 
                onClick={handleCheckout}
                className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
              >
                ยืนยันการสั่งซื้อ
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Cart;