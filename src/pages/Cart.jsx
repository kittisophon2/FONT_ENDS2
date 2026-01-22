import React, { useEffect, useState } from "react";
import CartService from "../Services/Cart.service";
import AuthService from "../Services/User.service"; // ⚠️ เช็คชื่อไฟล์ Service ให้ตรงกับที่คุณใช้ (User หรือ Auth)
import Layout from "../components/Layout";
import { Trash2, ShoppingBag, ArrowRight, Loader2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // 1. โหลดข้อมูล User และ ตะกร้าสินค้า
  useEffect(() => {
    // ดึง User จาก LocalStorage (แก้ตรงนี้ให้ตรงกับระบบ Login ของคุณ)
    // ปกติจะเก็บเป็น key "user" หรือ "token"
    const userStr = localStorage.getItem("user"); 
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      fetchCart(user.user_id); // ✅ ส่ง User ID ไปดึงตะกร้าทันที
    } else {
      setLoading(false); // ถ้าไม่ได้ล็อกอิน ก็หยุดโหลด
    }
  }, []);

  // 2. ฟังก์ชันดึงข้อมูลตะกร้า
  const fetchCart = async (userId) => {
    try {
      setLoading(true);
      const response = await CartService.getCartItems(userId);
      console.log("Cart Data:", response.data); // ดู Log ใน Browser ว่าข้อมูลมาไหม
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. คำนวณราคารวมอัตโนมัติ
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      // ป้องกัน Error กรณี product เป็น null
      const price = item.product?.price || 0; 
      return sum + (price * item.quantity);
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  // 4. ฟังก์ชันลบสินค้า
  const handleRemove = async (orderItemId) => {
    if (window.confirm("ต้องการลบสินค้านี้ใช่ไหม?")) {
      try {
        await CartService.removeFromCart(orderItemId);
        // ลบออกจากหน้าจอทันที (ไม่ต้องโหลดใหม่ให้เสียเวลา)
        setCartItems(prev => prev.filter(item => item.order_item_id !== orderItemId));
      } catch (error) {
        alert("ลบไม่สำเร็จ");
      }
    }
  };

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    </Layout>
  );

  // กรณีไม่ได้ Login หรือ ตะกร้าว่าง
  if (!currentUser) return (
    <Layout>
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบเพื่อดูตะกร้าสินค้า</h2>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-full">ไปหน้า Login</Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12 font-sans">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="text-blue-600" size={28} />
            <h1 className="text-3xl font-bold text-slate-800">ตะกร้าสินค้า</h1>
            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
              {cartItems.length} รายการ
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
              <p className="text-gray-500 mb-8">ยังไม่มีสินค้าในตะกร้า</p>
              <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-full">เลือกซื้อสินค้า</Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* รายการสินค้า */}
              <div className="flex-1 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.order_item_id} className="bg-white p-5 rounded-2xl shadow-sm flex gap-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product?.product_image || "https://placehold.co/150"} 
                        alt={item.product?.product_name} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.product?.product_name}</h3>
                      <p className="text-blue-600 font-bold text-xl mt-2">
                        ฿{(item.product?.price || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => handleRemove(item.order_item_id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={20} />
                      </button>
                      <span className="bg-gray-100 px-3 py-1 rounded text-sm">x {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* สรุปยอดเงิน */}
              <div className="lg:w-96">
                <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
                  <h3 className="text-xl font-bold mb-6">สรุปคำสั่งซื้อ</h3>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-lg">ยอดสุทธิ</span>
                    <span className="font-bold text-2xl text-blue-600">฿{totalPrice.toLocaleString()}</span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
                    ชำระเงิน <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;