import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAllOrders();
      setOrders(response.data.orders);
    } catch (err) {
      setError('অর্ডার লোড করতে সমস্যা হয়েছে: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh orders after update
      alert(`অর্ডার স্ট্যাটাস আপডেট হয়েছে: ${newStatus === 'confirmed' ? 'সফল' : 'বাতিল'}`);
    } catch (err) {
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div className="text-white text-center py-8">অর্ডার লোড হচ্ছে...</div>;
  }

  if (error) {
    return <div className="text-red-300 text-center py-8">এরর: {error}</div>;
  }

  return (
    <div className="p-4 glass-card">
      <h2 className="text-2xl font-bold text-white mb-6">অর্ডার ম্যানেজমেন্ট</h2>
      
      {orders.length === 0 ? (
        <p className="text-white/70 text-center">কোন অর্ডার পাওয়া যায়নি।</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-glass-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-white/20">
                <th className="py-3 px-4 text-left text-white">ইউজার</th>
                <th className="py-3 px-4 text-left text-white">সার্ভিস</th>
                <th className="py-3 px-4 text-left text-white">পরিমাণ</th>
                <th className="py-3 px-4 text-left text-white">টার্গেট</th>
                <th className="py-3 px-4 text-left text-white">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-left text-white">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-white/10 last:border-b-0">
                  <td className="py-3 px-4 text-white/80">
                    {order.user?.name} ({order.user?.email})
                  </td>
                  <td className="py-3 px-4 text-white/80">
                    {order.serviceTitle} ({order.serviceOption.name})
                  </td>
                  <td className="py-3 px-4 text-white/80">{order.amount} টাকা</td>
                  <td className="py-3 px-4 text-white/80">{order.targetNumber}</td>
                  <td className="py-3 px-4">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-semibold 
                        ${order.status === 'pending' ? 'bg-yellow-500/30 text-yellow-100' :
                          order.status === 'confirmed' ? 'bg-green-500/30 text-green-100' :
                          'bg-red-500/30 text-red-100'
                        }`}
                    >
                      {order.status === 'pending' ? 'পেন্ডিং' : order.status === 'confirmed' ? 'কনফার্মড' : 'বাতিল'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {order.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(order._id, 'confirmed')}
                          className="bg-green-500/30 text-green-100 px-3 py-1 rounded text-sm hover:bg-green-500/50 transition-colors"
                        >
                          কনফার্ম
                        </button>
                        <button
                          onClick={() => handleStatusChange(order._id, 'cancelled')}
                          className="bg-red-500/30 text-red-100 px-3 py-1 rounded text-sm hover:bg-red-500/50 transition-colors"
                        >
                          বাতিল
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement; 