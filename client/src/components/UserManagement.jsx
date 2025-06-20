import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    balance: 0
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('ইউজার লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ ...user, password: '' }); // Don't pre-fill password
    setErrors({});
    setMessage('');
  };

  const handleDeleteClick = async (userId) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই ইউজারকে ডিলিট করতে চান?')) {
      try {
        const response = await adminAPI.deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId)); // Use _id as per backend
        setMessage(response.data.message);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'ইউজার ডিলিট করতে সমস্যা হয়েছে।';
        setMessage(errorMessage);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'নাম প্রয়োজন';
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
    if (formData.password && formData.password.length !== 7) {
      newErrors.password = 'পাসওয়ার্ড ঠিক ৭ অক্ষর হতে হবে';
    }
    if (formData.balance < 0) newErrors.balance = 'ব্যালেন্স ঋণাত্মক হতে পারে না';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userId = editingUser._id; // Use _id from backend
      let userUpdated = false;

      // Update general info (name, email, phone)
      const infoUpdateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      // Only send if there are changes in info
      if (infoUpdateData.name !== editingUser.name || infoUpdateData.email !== editingUser.email || infoUpdateData.phone !== editingUser.phone) {
        const infoResponse = await adminAPI.updateUserInfo(userId, infoUpdateData);
        setMessage(infoResponse.data.message);
        userUpdated = true;
      }

      // Update balance
      if (formData.balance !== editingUser.balance) {
        const balanceResponse = await adminAPI.updateUserBalance(userId, Number(formData.balance));
        setMessage(balanceResponse.data.message);
        userUpdated = true;
      }

      // Update password (if provided)
      if (formData.password) {
        const passwordResponse = await adminAPI.updateUserPassword(userId, formData.password);
        setMessage(passwordResponse.data.message);
        userUpdated = true;
      }

      if (userUpdated) {
        // Re-fetch users to get the latest data after updates
        await fetchUsers();
        setMessage('ইউজার সফলভাবে আপডেট করা হয়েছে!');
        setEditingUser(null);
      } else {
        setMessage('কোনো পরিবর্তন সনাক্ত করা যায়নি।');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'ইউজার আপডেট করতে সমস্যা হয়েছে।';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 text-center glow-effect">
        ইউজার ম্যানেজমেন্ট
      </h2>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm mb-4 ${
            message.includes('সফলভাবে')
              ? 'bg-green-500/20 text-green-200'
              : 'bg-red-500/20 text-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-white/80 text-center">ইউজার লোড হচ্ছে...</p>
      ) : users.length === 0 ? (
        <p className="glass-card p-6 text-white/80 text-center">
          কোনো ইউজার পাওয়া যায়নি।
        </p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user._id} className="glass-card p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="glass-button text-sm px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30"
                  >
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user._id)}
                    className="glass-button text-sm px-3 py-1 bg-red-500/20 hover:bg-red-500/30"
                  >
                    ডিলিট
                  </button>
                </div>
              </div>
              <p className="text-white/80 text-sm">ইমেইল: {user.email}</p>
              <p className="text-white/80 text-sm">ফোন: {user.phone}</p>
              <p className="text-white/80 text-sm">ব্যালেন্স: {user.balance} টাকা</p>
              {user.isAdmin && <p className="text-blue-300 text-sm font-semibold mt-1">এডমিন</p>}

              {editingUser && editingUser._id === user._id && (
                <form onSubmit={handleSave} className="mt-6 pt-4 border-t border-white/20 space-y-4">
                  <h4 className="text-lg font-bold text-white mb-2">ইউজার এডিট করুন</h4>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">নাম</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" />
                    {errors.name && <p className="text-red-300 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">ফোন নাম্বার</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
                    {errors.phone && <p className="text-red-300 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">ইমেইল</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
                    {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">ব্যালেন্স</label>
                    <input type="number" name="balance" value={formData.balance} onChange={handleChange} className="form-input" />
                    {errors.balance && <p className="text-red-300 text-sm mt-1">{errors.balance}</p>}
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">নতুন পাসওয়ার্ড (ঐচ্ছিক, ৭ অক্ষর)</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" maxLength={7} />
                    {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button type="button" onClick={() => setEditingUser(null)} className="flex-1 glass-button bg-red-500/20 hover:bg-red-500/30">বাতিল</button>
                    <button type="submit" className="flex-1 glass-button">সেভ করুন</button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement; 