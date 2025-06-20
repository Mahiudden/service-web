import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMoneyAPI } from '../services/api';
import { authAPI } from '../services/api';

const AddMoneyPage = () => {
  const [formData, setFormData] = useState({
    amount: '',
    senderNumber: '',
    transactionNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState(''); // For displaying API messages
  const [userBalance, setUserBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const response = await authAPI.getMe();
        if (response.data.user) {
          setUserBalance(response.data.user.balance);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };
    fetchUserBalance();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount) {
      newErrors.amount = 'টাকার পরিমাণ প্রয়োজন';
    } else if (isNaN(formData.amount) || parseInt(formData.amount) <= 0) {
      newErrors.amount = 'সঠিক টাকার পরিমাণ দিন';
    }
    
    if (!formData.senderNumber) {
      newErrors.senderNumber = 'সেন্ডার নাম্বার প্রয়োজন';
    } else if (!/^01[3-9]\d{8}$/.test(formData.senderNumber)) {
      newErrors.senderNumber = 'সঠিক বিকাশ নাম্বার দিন';
    }
    
    if (!formData.transactionNumber) {
      newErrors.transactionNumber = 'ট্রানজেকশন নাম্বার প্রয়োজন';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const response = await addMoneyAPI.createRequest({
        amount: parseInt(formData.amount),
        senderNumber: formData.senderNumber,
        transactionId: formData.transactionNumber,
      });
      setMessage(response.data.message); // Set success message from API
      
      // Optionally, refetch user balance after successful request (though it's pending approval)
      // const userResponse = await authAPI.getMe();
      // if (userResponse.data.user) {
      //   setUserBalance(userResponse.data.user.balance);
      //   localStorage.setItem('user', JSON.stringify(userResponse.data.user));
      // }

      // Navigate after a short delay or based on user action
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'এড মানি রিকোয়েস্ট করতে সমস্যা হয়েছে।';
      setMessage(errorMessage);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    setMessage(''); // Clear message on new input
  };

  if (message.includes('সফলভাবে')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 rounded-3xl shadow-xl w-full max-w-lg mx-auto p-6 sm:p-8 text-center transform transition-all duration-300 ease-out animate-scale-in">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">সফল!</h2>
            <p className="text-white/80 mb-4">
              {message}
            </p>
            <p className="text-white/70 text-sm">
              অনুগ্রহ করে ৫ মিনিট অপেক্ষা করুন। ৫ মিনিটের মধ্যে টাকা এড না হলে কন্টাক্ট অপশন থেকে আমাদের সাথে WhatsApp বা টেলিগ্রামে যোগাযোগ করুন। ধন্যবাদ।
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="glass-button w-full"
          >
            ঠিক আছে
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 rounded-3xl shadow-xl w-full max-w-lg mx-auto relative p-6 sm:p-8 transform transition-all duration-300 ease-out animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">এড মানি</h2>
          <p className="text-white/80 text-lg">আপনার অ্যাকাউন্টে টাকা যোগ করুন</p>
        </div>

        {/* Bikash Number Section */}
        <div className="bg-white/10 rounded-xl p-5 mb-7 shadow-inner border border-white/20 backdrop-blur-sm">
          <p className="text-white text-center font-semibold mb-2">আমাদের বিকাশ নাম্বার</p>
          <p className="text-4xl font-extrabold text-white text-center tracking-wide mb-3">01829534989</p>
          <p className="text-white/70 text-sm text-center leading-relaxed">
            উপরের নাম্বারে সেন্ড মানি করে নিচের ফরম পুরন করুন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white text-base font-medium mb-2">
              টাকার পরিমাণ
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-white/15 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/20 transition-all duration-200"
              placeholder="টাকার পরিমাণ দিন"
              min="1"
            />
            {errors.amount && (
              <p className="text-red-300 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-white text-base font-medium mb-2">
              যে নাম্বার দিয়ে টাকা দিয়েছেন
            </label>
            <input
              type="tel"
              name="senderNumber"
              value={formData.senderNumber}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-white/15 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/20 transition-all duration-200"
              placeholder="বিকাশ নাম্বার দিন"
            />
            {errors.senderNumber && (
              <p className="text-red-300 text-sm mt-1">{errors.senderNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-white text-base font-medium mb-2">
              ট্রানজেকশন নাম্বার
            </label>
            <input
              type="text"
              name="transactionNumber"
              value={formData.transactionNumber}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-white/15 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/20 transition-all duration-200"
              placeholder="ট্রানজেকশন নাম্বার দিন"
            />
            {errors.transactionNumber && (
              <p className="text-red-300 text-sm mt-1">{errors.transactionNumber}</p>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              সাবমিট
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMoneyPage; 