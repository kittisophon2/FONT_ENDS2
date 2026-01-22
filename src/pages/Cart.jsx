import React, { useEffect, useState } from "react";
import CartService from "../Services/Cart.service";
import Layout from "../components/Layout";
import { Trash2, ShoppingBag } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. โหลดข้อมูลตะกร้า
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await CartService.getCartItems();
      // ตรวจสอบว่า response.data เป็น Array หรือไม่
      const items = Array.isArray(response.data) ? response.data : [];
      setCartItems(items);
      calculateTotal(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]); // กัน error กรณี fetch ไม่ได้
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
      // ป้องกันกรณีสินค้าถูกลบแต่ยังค้างในตะกร้า (item.product อาจเป็น null)
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    setTotalPrice(total);
  };

  // 3. ลบสินค้า
  const handleRemove = async (itemId) => {
    if (window.confirm("ต้องการลบสินค้านี้ใช่ไหม?")) {
      try {
        await CartService.removeFromCart(itemId);
        // ลบออกจาก State ทันทีเพื่อให้ UI ลื่นไหล ไม่ต้องรอ fetch ใหม่
        const updatedItems = cartItems.filter(item => item.order_item_id !== itemId);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      } catch (error) {
        console.error(error);
        alert("ลบสินค้าไม่สำเร็จ");
        fetchCart(); // ถ้าลบพลาด ให้ดึงข้อมูลใหม่มาทับ
      }
    }
  };

  // 4. สั่งซื้อ
  const handleCheckout = async () => {
    try {
      await CartService.checkout();
      alert("สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ");
      navigate("/"); 
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-gray-500 animate-pulse flex items-center gap-2">
             <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
             กำลังโหลดตะกร้าสินค้า...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-slate-800 flex items-center gap-2">
            <ShoppingBag className="text-blue-600" /> ตะกร้าสินค้าของฉัน
          </h1>
          
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">ไม่มีสินค้าในตะกร้า</h3>
              <p className="text-gray-500 mb-6">เลือกซื้อสินค้า IT คุณภาพเยี่ยมได้เลยตอนนี้</p>
              <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
                ไปเลือกซื้อสินค้า
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* รายการสินค้า */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.order_item_id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition hover:shadow-md group">
                    {/* รูปภาพ */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        <img 
                        src={item.product?.product_image || "https://placehold.co/100"} 
                        alt={item.product?.product_name || "สินค้า"} 
                        className="w-full h-full object-contain mix-blend-multiply p-2"
                        />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate" title={item.product?.product_name}>
                        {item.product?.product_name || "สินค้าไม่ระบุชื่อ"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{item.product?.brand || "Brand"}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-4">
                          <p className="text-blue-600 font-bold text-lg">
                            ฿{(item.product?.price || 0).toLocaleString()}
                          </p>
                          {item.product?.stock < item.quantity && (
                            <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">สินค้าไม่พอ</span>
                          )}
                      </div>
                    </div>

                    {/* ส่วนจัดการจำนวน */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg whitespace-nowrap">
                            จำนวน: {item.quantity}
                        </div>
                        <button 
                        onClick={() => handleRemove(item.order_item_id)} 
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 text-sm flex items-center gap-1 hover:bg-red-50 rounded-lg"
                        >
                        <Trash2 size={16} /> ลบ
                        </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* สรุปยอดสั่งซื้อ */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">สรุปคำสั่งซื้อ</h3>
                  
                  <div className="flex justify-between items-center mb-3 text-gray-600">
                    <span>จำนวนสินค้า</span>
                    <span className="font-medium">{cartItems.reduce((acc, item) => acc + item.quantity, 0)} ชิ้น</span>
                  </div>
                  <div className="flex justify-between items-center mb-3 text-gray-600">
                    <span>ค่าจัดส่ง</span>
                    <span className="text-green-600 font-medium">ฟรี</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-800">ยอดรวมสุทธิ</span>
                    <span className="text-2xl font-bold text-blue-600">฿{totalPrice.toLocaleString()}</span>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full mt-6 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ดำเนินการสั่งซื้อ
                  </button>
                  
                  <Link to="/" className="block text-center text-gray-500 text-sm mt-4 hover:text-blue-600 hover:underline">
                    เลือกซื้อสินค้าต่อ
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