import React from 'react';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`p-4 rounded-full ${color} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  // ข้อมูลสมมติ (ของจริงต้องดึงจาก API)
  const stats = [
    { title: "ยอดขายรวม", value: "฿125,000", icon: <DollarSign size={24} />, color: "bg-green-500" },
    { title: "คำสั่งซื้อทั้งหมด", value: "1,240", icon: <ShoppingBag size={24} />, color: "bg-blue-500" },
    { title: "ลูกค้าทั้งหมด", value: "350", icon: <Users size={24} />, color: "bg-purple-500" },
    { title: "สินค้าในระบบ", value: "48", icon: <Package size={24} />, color: "bg-orange-500" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">ภาพรวมระบบ</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Orders (ตัวอย่าง) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">คำสั่งซื้อล่าสุด</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 border-b border-gray-100">
                <th className="py-3 font-medium">Order ID</th>
                <th className="py-3 font-medium">ลูกค้า</th>
                <th className="py-3 font-medium">สถานะ</th>
                <th className="py-3 font-medium">ยอดเงิน</th>
              </tr>
            </thead>
            <tbody>
              {/* ข้อมูลสมมติ */}
              <tr className="border-b border-gray-50">
                <td className="py-3">#ORD-001</td>
                <td className="py-3">สมชาย ใจดี</td>
                <td className="py-3"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">รอชำระเงิน</span></td>
                <td className="py-3">฿1,500</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-3">#ORD-002</td>
                <td className="py-3">มานี มีตา</td>
                <td className="py-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">สำเร็จ</span></td>
                <td className="py-3">฿890</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;