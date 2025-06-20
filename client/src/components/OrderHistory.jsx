import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await ordersAPI.getMyOrders();
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 text-center glow-effect">
        অর্ডার হিস্টরি
      </h2>

      {loading ? (
        <p className="text-white/80 text-center">অর্ডার লোড হচ্ছে...</p>
      ) : orders.length === 0 ? (
        <p className="glass-card p-6 text-white/80 text-center">
          আপনার কোন অর্ডার নেই।
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
              <div className="flex-1">
                <p className="text-white font-medium text-lg">{order.serviceTitle} - {order.serviceOption.name}</p>
                <p className="text-white/70 text-sm">অর্ডার আইডি: {order._id}</p>
                <p className="text-white/70 text-sm">তারিখ: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right md:text-left">
                <p className="text-blue-300 font-bold text-xl mb-1">{order.amount} টাকা</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      order.status === 'confirmed'
                        ? 'bg-green-500/20 text-green-300'
                        : order.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-red-500/20 text-red-300'
                    }
                  `}
                >
                  {order.status === 'confirmed' && 'সফল হয়েছে'}
                  {order.status === 'pending' && 'প্রক্রিয়াধীন'}
                  {order.status === 'cancelled' && 'বাতিল করা হয়েছে'}
                </span>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 w-full md:w-auto">
                <p className="text-white/80 text-sm italic">
                  {order.status === "pending" ? 'প্রক্রিয়াধীন' : ""}
                  {order.status === "confirmed" ? 'অনুগ্রহ করে আপনার দেয়া ইমেইল এর স্পাম বক্স চেক করুন। ধন্যবাদ' : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory; 