import React, { useEffect, useState } from "react";
import CartService from "../Services/Cart.service";
import Layout from "../components/Layout";
import { Trash2, ShoppingBag, ArrowRight, Loader2, Plus, Minus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await CartService.getCartItems();
      // ตรวจสอบข้อมูลก่อน set
      if (response.data && Array.isArray(response.data)) {
        setCartItems(response.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // คำนวณยอดรวมทุกครั้งที่ cartItems เปลี่ยน
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const handleRemove = async (itemId) => {
    if (window.confirm("ลบสินค้านี้ออกจากตะกร้า?")) {
      try {
        await CartService.removeFromCart(itemId);
        // ลบออกจาก State ทันที ไม่ต้องโหลดใหม่
        setCartItems(prev => prev.filter(item => item.order_item_id !== itemId));
      } catch (error) {
        alert("ลบไม่สำเร็จ กรุณาลองใหม่");
      }
    }
  };

  const handleCheckout = async () => {
    try {
      await CartService.checkout();
      alert("สั่งซื้อสำเร็จ!");
      navigate("/orders"); // หรือหน้าอื่นตามต้องการ
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
    }
  };

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12 font-sans">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingBag className="text-blue-600" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">ตะกร้าสินค้า</h1>
            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {cartItems.length} รายการ
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="bg-gray-50 p-6 rounded-full mb-6">
                <ShoppingBag className="text-gray-300" size={64} />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">ตะกร้าของคุณว่างเปล่า</h3>
              <p className="text-gray-500 mb-8">เลือกหาสินค้าที่ถูกใจแล้วนำมาใส่ตะกร้าได้เลย</p>
              <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">
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
                        src={item.product?.product_image || "https://placehold.co/150"} 
                        alt={item.product?.product_name} 
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 line-clamp-1">
                          {item.product?.product_name || "สินค้าไม่ระบุชื่อ"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">รหัส: {item.product_id}</p>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <p className="text-blue-600 font-bold text-xl">
                          ฿{(item.product?.price || 0).toLocaleString()}
                        </p>
                        
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                            จำนวน: {item.quantity}
                          </span>
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
                  </div>
                ))}
              </div>

              {/* Summary Section */}
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
                      <span className="text-green-600">ฟรี</span>
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
                    ดำเนินการชำระเงิน 
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                  </button>
                  
                  <Link to="/" className="block text-center text-gray-500 text-sm mt-4 hover:text-blue-600 hover:underline">
                    เลือกซื้อสินค้าเพิ่มเติม
                  </Link>
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