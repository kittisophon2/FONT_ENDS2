import React, { useEffect, useState } from "react";
import CartService from "../Services/Cart.service";
import Layout from "../components/Layout";
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. ฟังก์ชันดึงข้อมูลตะกร้า
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await CartService.getCartItems();
      
      // ตรวจสอบว่ามีข้อมูลกลับมาจริงไหม
      if (response.data && Array.isArray(response.data)) {
        setCartItems(response.data);
        calculateTotal(response.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      // ถ้า Error 401/403 แปลว่า Token หมดอายุ ให้เด้งไป Login
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. คำนวณราคารวม
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      // ใช้ราคาจาก Product เป็นหลัก (ป้องกันกรณีข้อมูลไม่ครบใช้ 0 แทน)
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    setTotalPrice(total);
  };

  // 3. ลบสินค้าออกจากตะกร้า
  const handleRemove = async (itemId) => {
    if (window.confirm("คุณต้องการลบสินค้านี้ออกจากตะกร้าใช่หรือไม่?")) {
      try {
        await CartService.removeFromCart(itemId);
        // อัปเดตหน้าจอทันทีโดยไม่ต้องโหลดใหม่
        const updatedItems = cartItems.filter(item => item.order_item_id !== itemId);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      } catch (error) {
        console.error("Remove failed:", error);
        alert("ลบสินค้าไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        fetchCart(); // ถ้าพลาดให้ดึงข้อมูลใหม่
      }
    }
  };

  // 4. สั่งซื้อสินค้า (Checkout)
  const handleCheckout = async () => {
    try {
      await CartService.checkout();
      alert("🎉 สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ");
      navigate("/"); // หรือพาไปหน้าประวัติการสั่งซื้อ
    } catch (error) {
      console.error("Checkout error:", error);
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
    }
  };

  // --- ส่วนแสดงผล (UI) ---

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-gray-500 font-medium">กำลังโหลดตะกร้าสินค้า...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <ShoppingBag size={28} />
              </div>
              ตะกร้าสินค้าของฉัน
            </h1>
            <span className="text-gray-500 text-sm hidden sm:block">
              {cartItems.length} รายการในตะกร้า
            </span>
          </div>
          
          {cartItems.length === 0 ? (
            // --- กรณีตะกร้าว่าง ---
            <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100 flex flex-col items-center">
              <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={64} className="text-blue-200" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">ตะกร้าของคุณว่างเปล่า</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                ดูเหมือนคุณยังไม่ได้เลือกสินค้าที่ถูกใจ ลองกลับไปเลือกดูสินค้าใหม่ๆ ของเราได้เลย
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 transform hover:-translate-y-1"
              >
                เลือกซื้อสินค้า <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          ) : (
            // --- กรณีมีสินค้า ---
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* รายการสินค้า (Left Column) */}
              <div className="flex-1 space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={item.order_item_id} 
                    className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-md group"
                  >
                    {/* รูปภาพ */}
                    <div className="w-32 h-32 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 p-2">
                        <img 
                          src={item.product?.product_image || "https://placehold.co/200?text=No+Image"} 
                          alt={item.product?.product_name || "สินค้า"} 
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    
                    {/* รายละเอียด */}
                    <div className="flex-1 text-center sm:text-left w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
                            {item.product?.brand || "IT Product"}
                          </p>
                          <Link to={`/content/${item.product_id}`} className="hover:underline">
                            <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-1">
                              {item.product?.product_name || "ไม่พบชื่อสินค้า"}
                            </h3>
                          </Link>
                        </div>
                      </div>

                      <div className="flex items-center justify-center sm:justify-between mt-4">
                        <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                           <span className="text-sm text-gray-500">จำนวน:</span>
                           <span className="font-bold text-slate-800">{item.quantity}</span>
                        </div>
                        <div className="text-right ml-4">
                           <p className="text-2xl font-bold text-blue-600">
                             ฿{(item.product?.price || 0).toLocaleString()}
                           </p>
                        </div>
                      </div>
                    </div>

                    {/* ปุ่มลบ */}
                    <button 
                      onClick={() => handleRemove(item.order_item_id)} 
                      className="absolute top-4 right-4 sm:static text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                      title="ลบรายการนี้"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* สรุปยอด (Right Column) */}
              <div className="lg:w-96">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-gray-100">
                    สรุปคำสั่งซื้อ
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>ยอดรวมสินค้า ({cartItems.reduce((a, b) => a + b.quantity, 0)} ชิ้น)</span>
                      <span>฿{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>ค่าจัดส่ง</span>
                      <span className="text-green-600 font-medium">ฟรี</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-6">
                    <span className="text-lg font-bold text-slate-800">ยอดรวมสุทธิ</span>
                    <span className="text-3xl font-bold text-blue-600">฿{totalPrice.toLocaleString()}</span>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    ชำระเงิน <ArrowRight size={20} />
                  </button>
                  
                  <Link to="/" className="block text-center text-gray-500 text-sm mt-4 hover:text-blue-600 hover:underline">
                    เลือกซื้อสินค้าเพิ่มเติม
                  </Link>
                </div>
                
                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                   <span>🔒 ชำระเงินปลอดภัย 100%</span>
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