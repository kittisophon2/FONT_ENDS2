import React, { useEffect, useState } from "react";
import CartService from "../Services/Cart.service";
import Layout from "../components/Layout";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
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
      setCartItems(response.data);
      calculateTotal(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
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
      // ใช้ราคาจาก item.product.price เป็นหลัก
      return sum + (item.product.price * item.quantity);
    }, 0);
    setTotalPrice(total);
  };

  // 3. ลบสินค้า (ใช้ order_item_id)
  const handleRemove = async (itemId) => {
    if (confirm("ต้องการลบสินค้านี้ใช่ไหม?")) {
      try {
        await CartService.removeFromCart(itemId);
        fetchCart(); // โหลดใหม่เพื่อให้ข้อมูลอัปเดต
      } catch (error) {
        alert("ลบสินค้าไม่สำเร็จ");
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
          <p className="text-gray-500 animate-pulse">กำลังโหลดตะกร้าสินค้า...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
            <ShoppingBag className="text-blue-600" /> ตะกร้าสินค้าของฉัน
          </h1>
          
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">ไม่มีสินค้าในตะกร้า</h3>
              <p className="text-gray-500 mb-6">เลือกซื้อสินค้า IT คุณภาพเยี่ยมได้เลยตอนนี้</p>
              <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                ไปเลือกซื้อสินค้า
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* รายการสินค้า */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.order_item_id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 transition hover:shadow-md">
                    {/* รูปภาพ (แก้ให้ใช้ URL ตรงๆ จาก Backend) */}
                    <img 
                      src={item.product.product_image || "https://placehold.co/100"} 
                      alt={item.product.product_name} 
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    
                    <div className="flex-1 text-center sm:text-left">
                      {/* แก้ title เป็น product_name */}
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {item.product.product_name}
                      </h3>
                      <p className="text-blue-600 font-bold mt-1">
                        ฿{item.product.price?.toLocaleString()}
                      </p>
                      {item.product.stock < item.quantity && (
                        <p className="text-xs text-red-500 mt-1">สินค้าคงเหลือไม่พอ</p>
                      )}
                    </div>

                    {/* ส่วนจัดการจำนวน (แสดงผลเท่านั้น ถ้าจะแก้ต้องเพิ่ม API update) */}
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 px-2 py-1">
                      <span className="text-sm font-medium text-gray-600 px-2">จำนวน: {item.quantity}</span>
                    </div>

                    <button 
                      onClick={() => handleRemove(item.order_item_id)} // แก้ cart_id เป็น order_item_id
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                      title="ลบสินค้า"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* สรุปยอดสั่งซื้อ */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-4">สรุปคำสั่งซื้อ</h3>
                  
                  <div className="flex justify-between items-center mb-2 text-gray-600">
                    <span>จำนวนสินค้า</span>
                    <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)} ชิ้น</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 text-2xl font-bold text-blue-600">
                    <span>ยอดรวมสุทธิ</span>
                    <span>฿{totalPrice.toLocaleString()}</span>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
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