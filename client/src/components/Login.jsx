import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'ইমেইল প্রয়োজন';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'সঠিক ইমেইল দিন';
    }
    
    if (!formData.password) {
      newErrors.password = 'পাসওয়ার্ড প্রয়োজন';
    } else if (formData.password.length !== 7) {
      newErrors.password = 'পাসওয়ার্ড ঠিক ৭ অক্ষর হতে হবে';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'লগইন করতে সমস্যা হয়েছে';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="glass-card p-8 w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm mb-4">
            <span className="">
               <img className='w-[60px] rounded-4xl' src="image.png" alt="" />
            </span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Elite Services</h1>
          <p className="text-white/80">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚠️</span>
                <span>{errors.general}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-white text-sm font-medium">
              <span className="flex items-center space-x-2">
                <span>📧</span>
                <span>ইমেইল</span>
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="আপনার ইমেইল দিন"
            />
            {errors.email && (
              <p className="text-red-300 text-sm flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-white text-sm font-medium">
              <span className="flex items-center space-x-2">
                <span>🔒</span>
                <span>পাসওয়ার্ড</span>
              </span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="আপনার পাসওয়ার্ড দিন"
              maxLength={7}
            />
            {errors.password && (
              <p className="text-red-300 text-sm flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="glass-button w-full disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>লগইন হচ্ছে...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>লগইন করুন</span>
              </span>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-white/70">
            অ্যাকাউন্ট নেই?{' '}
            <Link to="/register" className="text-blue-300 hover:text-blue-200 font-medium transition-colors duration-200">
              রেজিস্ট্রেশন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 