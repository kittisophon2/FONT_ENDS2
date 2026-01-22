import React, { useEffect, useState } from "react";
import CartService from "../Services/Cart.service";
import Layout from "../components/Layout";
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // 1. ตรวจสอบ User และโหลดข้อมูล
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      fetchCart(user.user_id);
    } else {
      setLoading(false);
    }
  }, []);

  // 2. คำนวณราคารวมเมื่อ cartItems เปลี่ยน
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      // ป้องกันกรณี product เป็น null (สินค้าผี)
      const price = item.product ? item.product.price : 0;
      return sum + (price * item.quantity);
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const fetchCart = async (userId) => {
    try {
      setLoading(true);
      const response = await CartService.getCartItems(userId);
      // ตรวจสอบว่าเป็น Array จริงไหม ก่อน set
      if (Array.isArray(response.data)) {
        setCartItems(response.data);
      } else {
        console.error("Cart data is not array:", response.data);
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (orderItemId) => {
    if (window.confirm("ต้องการลบสินค้านี้ใช่ไหม?")) {
      try {
        await CartService.removeFromCart(orderItemId);
        setCartItems(prev => prev.filter(item => item.order_item_id !== orderItemId));
      } catch (error) {
        alert("ลบไม่สำเร็จ กรุณาลองใหม่");
      }
    }
  };

  const handleCheckout = async () => {
    if (!currentUser) return;
    try {
      await CartService.checkout(currentUser.user_id);
      alert("สั่งซื้อสำเร็จ!");
      setCartItems([]); // เคลียร์ตะกร้าหน้าเว็บ
      navigate("/orders"); // ถ้ามีหน้าประวัติการสั่งซื้อ
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
      console.error(error);
    }
  };

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    </Layout>
  );

  if (!currentUser) return (
    <Layout>
      <div className="text-center py-20 min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-700">กรุณาเข้าสู่ระบบเพื่อดูตะกร้าสินค้า</h2>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
          เข้าสู่ระบบ
        </Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12 font-sans">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">ตะกร้าสินค้า</h1>
            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {cartItems.length} รายการ
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
              <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 mb-8 text-lg">ตะกร้าของคุณยังว่างอยู่</p>
              <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-medium shadow-md">
                เลือกซื้อสินค้า
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart List */}
              <div className="flex-1 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.order_item_id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-6 hover:shadow-md transition">
                    <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img 
                        src={item.product?.product_image || "https://placehold.co/150?text=No+Image"} 
                        alt={item.product?.product_name || "Unknown Product"} 
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 line-clamp-1">
                          {item.product?.product_name || "สินค้าไม่ระบุชื่อ"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">จำนวน: {item.quantity} ชิ้น</p>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <p className="text-blue-600 font-bold text-xl">
                          ฿{(item.product?.price || 0).toLocaleString()}
                        </p>
                        <button 
                          onClick={() => handleRemove(item.order_item_id)} 
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                          title="ลบรายการ"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:w-96">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">สรุปคำสั่งซื้อ</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>ยอดรวมสินค้า</span>
                      <span>฿{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>ค่าจัดส่ง</span>
                      <span className="text-green-600 font-medium">ฟรี</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-slate-800">ยอดสุทธิ</span>
                      <span className="font-bold text-2xl text-blue-600">฿{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2 group"
                  >
                    ชำระเงิน <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
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