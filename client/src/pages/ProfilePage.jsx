import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, ordersAPI } from '../services/api';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // profile, orders, stats
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchOrderHistory();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getMe();
      const userData = response.data.user;
      setUser(userData);
      setFormData({
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        password: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const confirmedOrders = orders.filter(order => order.status === 'confirmed').length;
    const totalSpent = orders
      .filter(order => order.status === 'confirmed')
      .reduce((sum, order) => sum + order.amount, 0);
    
    return { totalOrders, confirmedOrders, totalSpent };
  };

  const validateForm = () => {
    const newErrors = {};
    setMessage('');

    if (!formData.name.trim()) {
      newErrors.name = 'নাম প্রয়োজন';
    }

    if (!formData.phone) {
      newErrors.phone = 'ফোন নাম্বার প্রয়োজন';
    } else if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'সঠিক বাংলাদেশী ফোন নাম্বার দিন';
    }

    if (!formData.email) {
      newErrors.email = 'ইমেইল প্রয়োজন';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'সঠিক ইমেইল দিন';
    }

    if (isEditing && formData.newPassword) {
      if (!formData.password) {
        newErrors.password = 'বর্তমান পাসওয়ার্ড প্রয়োজন';
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে';
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'নতুন পাসওয়ার্ড মিলছে না';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
        updateData.currentPassword = formData.password;
      }

      const response = await authAPI.updateProfile(updateData);
      setMessage(response.data.message);
      setIsEditing(false);
      
      // Update user in localStorage and state
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);

      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        password: '',
        newPassword: '',
        confirmNewPassword: '',
      }));

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে।';
      setMessage(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-300';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'সফল হয়েছে';
      case 'pending':
        return 'প্রক্রিয়াধীন';
      case 'cancelled':
        return 'বাতিল করা হয়েছে';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">প্রোফাইল লোড হচ্ছে...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">ইউজার ডেটা পাওয়া যায়নি</div>
      </div>
    );
  }

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm mb-4">
            <span className="text-5xl">👤</span>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">প্রোফাইল</h1>
          <p className="text-white/80 text-lg">আপনার অ্যাকাউন্ট তথ্য এবং অর্ডার হিস্টরি</p>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(user.name)}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
              <p className="text-white/70 mb-1">{user.email}</p>
              <p className="text-white/70 mb-4">{user.phone}</p>
              
              {/* Balance */}
              <div className="inline-block bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 mb-4">
                <p className="text-white/80 text-sm">বর্তমান ব্যালেন্স</p>
                <p className="text-2xl font-bold text-white">{user.balance} টাকা</p>
              </div>

              {user.isAdmin && (
                <div className="inline-block bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg p-3 mb-4">
                  <p className="text-red-300 font-semibold">এডমিন</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            প্রোফাইল
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            অর্ডার ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            পরিসংখ্যান
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="glass-card p-6">
        {!isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">নাম</label>
                    <p className="text-white text-lg">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">ইমেইল</label>
                    <p className="text-white text-lg">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">ফোন নাম্বার</label>
                    <p className="text-white text-lg">{user.phone}</p>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">অ্যাকাউন্ট টাইপ</label>
                    <p className="text-white text-lg">{user.isAdmin ? 'এডমিন' : 'সাধারণ ইউজার'}</p>
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
              <button
                onClick={() => setIsEditing(true)}
                    className="glass-button flex-1"
              >
                    প্রোফাইল এডিট করুন
              </button>
              <button
                onClick={handleLogout}
                    className="glass-button flex-1 bg-red-500/20 hover:bg-red-500/30"
              >
                লগআউট
              </button>
            </div>
          </div>
        ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div
                    className={`p-4 rounded-lg text-sm ${
                  message.includes('সফলভাবে')
                    ? 'bg-green-500/20 text-green-200'
                    : 'bg-red-500/20 text-red-200'
                }`}
              >
                {message}
              </div>
            )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                    <label className="block text-white text-sm font-medium mb-2">নাম</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
              {errors.name && (
                <p className="text-red-300 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
                    <label className="block text-white text-sm font-medium mb-2">ইমেইল</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                    {errors.email && (
                      <p className="text-red-300 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">ফোন নাম্বার</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
              {errors.phone && (
                <p className="text-red-300 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
                    <label className="block text-white text-sm font-medium mb-2">বর্তমান পাসওয়ার্ড</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                      placeholder="পাসওয়ার্ড পরিবর্তন করতে চাইলে"
                />
                {errors.password && (
                  <p className="text-red-300 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                    <label className="block text-white text-sm font-medium mb-2">নতুন পাসওয়ার্ড</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-input"
                      placeholder="নতুন পাসওয়ার্ড"
                />
                {errors.newPassword && (
                  <p className="text-red-300 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>
              <div>
                    <label className="block text-white text-sm font-medium mb-2">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  className="form-input"
                      placeholder="নতুন পাসওয়ার্ড আবার দিন"
                />
                {errors.confirmNewPassword && (
                  <p className="text-red-300 text-sm mt-1">{errors.confirmNewPassword}</p>
                )}
              </div>
            </div>
                
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                    className="glass-button flex-1 bg-red-500/20 hover:bg-red-500/30"
              >
                বাতিল
              </button>
                  <button type="submit" className="glass-button flex-1">
                    সেভ করুন
              </button>
            </div>
          </form>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="glass-card p-6">
            <h3 className="text-2xl font-bold text-white mb-6">অর্ডার হিস্টরি</h3>
            
            {ordersLoading ? (
              <div className="text-center py-8">
                <div className="text-white/80">অর্ডার লোড হচ্ছে...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-white/80 text-lg">আপনার কোনো অর্ডার নেই</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="glass-button mt-4"
                >
                  সার্ভিস দেখুন
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg">{order.serviceTitle}</h4>
                        <p className="text-white/70 text-sm">{order.serviceOption.name}</p>
                        <p className="text-white/70 text-sm">টার্গেট: {order.targetNumber}</p>
                        <p className="text-white/70 text-sm">
                          তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-300 font-bold text-xl mb-1">{order.amount} টাকা</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="glass-card p-6">
            <h3 className="text-2xl font-bold text-white mb-6">পরিসংখ্যান</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">📦</div>
                <div className="text-2xl font-bold text-white mb-1">{stats.totalOrders}</div>
                <div className="text-white/70">মোট অর্ডার</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold text-white mb-1">{stats.confirmedOrders}</div>
                <div className="text-white/70">সফল অর্ডার</div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-white mb-1">{stats.totalSpent.toLocaleString('bn-BD')}</div>
                <div className="text-white/70">মোট খরচ (টাকা)</div>
              </div>
            </div>

            {stats.totalOrders > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">সাফল্যের হার</h4>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80">সফল অর্ডার</span>
                    <span className="text-white font-semibold">
                      {Math.round((stats.confirmedOrders / stats.totalOrders) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(stats.confirmedOrders / stats.totalOrders) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 