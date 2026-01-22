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

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await CartService.getCartItems();
      
      console.log("Cart Data:", response.data); // ✅ ดูตรงนี้ใน Console (F12) ว่ามีข้อมูลมาไหม

      if (response.data && Array.isArray(response.data)) {
        setCartItems(response.data);
        calculateTotal(response.data);
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

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      // ✅ ใช้ Optional Chaining ป้องกัน error
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    setTotalPrice(total);
  };

  const handleRemove = async (itemId) => {
    if (window.confirm("ลบสินค้านี้ออกจากตะกร้า?")) {
      try {
        await CartService.removeFromCart(itemId);
        // อัปเดตหน้าจอทันที
        const updated = cartItems.filter(item => item.order_item_id !== itemId);
        setCartItems(updated);
        calculateTotal(updated);
      } catch (error) {
        alert("ลบไม่สำเร็จ");
      }
    }
  };

  const handleCheckout = async () => {
    try {
      await CartService.checkout();
      alert("สั่งซื้อสำเร็จ!");
      navigate("/");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
    }
  };

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <ShoppingBag className="text-blue-600" /> ตะกร้าสินค้า
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <p className="text-gray-500 mb-4">ไม่มีสินค้าในตะกร้า</p>
              <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                เลือกซื้อสินค้า
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* List */}
              <div className="flex-1 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.order_item_id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                    <img 
                      src={item.product?.product_image || "https://placehold.co/150"} 
                      alt="Product" 
                      className="w-24 h-24 object-contain border rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.product?.product_name || "สินค้าไม่ระบุชื่อ"}</h3>
                      <p className="text-blue-600 font-bold">฿{(item.product?.price || 0).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">จำนวน: {item.quantity}</p>
                    </div>
                    <button onClick={() => handleRemove(item.order_item_id)} className="text-red-400 hover:text-red-600 p-2">
                      <Trash2 />
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:w-80 bg-white p-6 rounded-xl shadow-sm h-fit sticky top-24">
                <h3 className="text-xl font-bold mb-4">สรุปยอด</h3>
                <div className="flex justify-between mb-4">
                  <span>ราคารวม</span>
                  <span className="font-bold text-blue-600">฿{totalPrice.toLocaleString()}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex justify-center items-center gap-2"
                >
                  ชำระเงิน <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;