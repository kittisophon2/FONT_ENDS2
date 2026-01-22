import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, Loader2, Minus, Plus, CreditCard } from "lucide-react";
import CartService from "../Services/Cart.service";
import Layout from "../components/Layout";
import { jwtDecode } from "jwt-decode";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  // 1. โหลดข้อมูลตะกร้าเมื่อเข้าหน้าเว็บ
  useEffect(() => {
    fetchCartItems();
  }, []);

  // 2. คำนวณราคารวมทุกครั้งที่ cartItems เปลี่ยนแปลง
  useEffect(() => {
    calculateTotal(cartItems);
  }, [cartItems]);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return; // ถ้าไม่มี Token ให้แสดงหน้าว่าง (หรือ Redirect ไป Login)
    }

    try {
      // ถอดรหัส Token เพื่อเอา User ID
      const decoded = jwtDecode(token);
      const userId = decoded.user_id || decoded.userId;

      setLoading(true);
      const response = await CartService.getCartItems(userId);
      
      if (Array.isArray(response.data)) {
        setCartItems(response.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      // กรณี Token หมดอายุหรือ Error อื่นๆ
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    setTotalPrice(total);
  };

  // ฟังก์ชันลบสินค้า
  const handleRemoveItem = async (orderItemId) => {
    if (window.confirm("คุณต้องการลบสินค้านี้ออกจากตะกร้าใช่หรือไม่?")) {
      try {
        await CartService.removeFromCart(orderItemId);
        // อัปเดต State โดยกรองเอาอันที่ลบออกไปเลย (ไม่ต้องโหลดใหม่)
        setCartItems(prev => prev.filter(item => item.order_item_id !== orderItemId));
      } catch (error) {
        console.error("Remove Error:", error);
        alert("ลบสินค้าไม่สำเร็จ");
      }
    }
  };

  // ฟังก์ชันอัปเดตจำนวน (เพิ่ม/ลด)
  const handleUpdateQuantity = async (orderItemId, currentQty, change, stock) => {
    const newQty = currentQty + change;

    // เช็คเงื่อนไข: ห้ามต่ำกว่า 1 และห้ามเกิน Stock
    if (newQty < 1) return;
    if (newQty > stock) {
      alert(`มีสินค้าเพียง ${stock} ชิ้น`);
      return;
    }

    try {
      // อัปเดตใน Backend
      await CartService.updateQuantity(orderItemId, newQty);
      
      // อัปเดตในหน้าจอทันที
      setCartItems(prev => prev.map(item => 
        item.order_item_id === orderItemId 
          ? { ...item, quantity: newQty } 
          : item
      ));
    } catch (error) {
      console.error("Update Quantity Error:", error);
    }
  };

  const handleCheckout = () => {
    // ลิงก์ไปหน้าชำระเงิน (ถ้ามี) หรือทำฟังก์ชัน Checkout
    alert("ระบบชำระเงินกำลังพัฒนา...");
    // navigate("/checkout"); 
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex justify-center items-center">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </Layout>
    );
  }

  // กรณีไม่ได้ Login หรือไม่มี Token
  if (!localStorage.getItem("token")) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col justify-center items-center text-center py-20">
          <ShoppingBag size={64} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-gray-500 mb-6">เพื่อดูรายการสินค้าในตะกร้าของคุณ</p>
          <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition shadow-lg">
            เข้าสู่ระบบ
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12 font-sans">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-3 rounded-full shadow-sm text-blue-600">
               <ShoppingBag size={28} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">ตะกร้าสินค้า</h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
              {cartItems.length} รายการ
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <ShoppingBag className="text-gray-300" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">ตะกร้าของคุณว่างเปล่า</h3>
              <p className="text-gray-500 mb-8">เลือกซื้อสินค้าที่คุณถูกใจได้เลย</p>
              <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition shadow-md inline-flex items-center gap-2">
                เลือกซื้อสินค้า <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* รายการสินค้า (Left Side) */}
              <div className="flex-1 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.order_item_id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-6 transition hover:shadow-md">
                    {/* รูปภาพ */}
                    <div className="w-28 h-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 relative">
                      <img 
                        src={item.product?.product_image || "https://placehold.co/150?text=No+Image"} 
                        alt={item.product?.product_name} 
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    
                    {/* รายละเอียด */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                           <h3 className="font-bold text-lg text-slate-800 line-clamp-1 pr-4">
                             {item.product?.product_name || "สินค้าไม่ระบุชื่อ"}
                           </h3>
                           <button 
                             onClick={() => handleRemoveItem(item.order_item_id)} 
                             className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition"
                             title="ลบสินค้า"
                           >
                             <Trash2 size={20} />
                           </button>
                        </div>
                        <p className="text-sm text-gray-500">{item.product?.brand || "Brand"}</p>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        {/* ปุ่มเพิ่ม/ลด จำนวน */}
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                          <button 
                            onClick={() => handleUpdateQuantity(item.order_item_id, item.quantity, -1, item.product?.stock)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-l-lg text-gray-600 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-bold text-sm text-gray-800">{item.quantity}</span>
                          <button 
                             onClick={() => handleUpdateQuantity(item.order_item_id, item.quantity, 1, item.product?.stock)}
                             className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-r-lg text-gray-600 disabled:opacity-50"
                             disabled={item.quantity >= (item.product?.stock || 99)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* ราคา */}
                        <div className="text-right">
                           <p className="text-blue-600 font-bold text-xl">฿{(item.product?.price || 0).toLocaleString()}</p>
                           {item.quantity > 1 && (
                             <p className="text-xs text-gray-400">ชิ้นละ ฿{(item.product?.price || 0).toLocaleString()}</p>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* สรุปยอดเงิน (Right Side) */}
              <div className="lg:w-96">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-blue-600" /> สรุปคำสั่งซื้อ
                  </h3>
                  
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
                    <p className="text-xs text-gray-400 text-right">รวมภาษีมูลค่าเพิ่มแล้ว</p>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2 group"
                  >
                    ดำเนินการชำระเงิน <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                  </button>
                  
                  <Link to="/products" className="block text-center mt-4 text-gray-500 hover:text-blue-600 text-sm underline">
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