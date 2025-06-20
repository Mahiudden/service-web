import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HamburgerMenu = ({ 
  user, 
  userBalance, 
  onLogout, 
  onMenuClick, 
  onClose,
  isAdmin = false
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Close the menu after navigation
  };

  return (
    <div className="hamburger-menu popup-overlay" onClick={onClose}>
      <div className="menu-content" onClick={(e) => e.stopPropagation()}>
        {/* Profile and Logout */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg backdrop-blur-sm">
          <button
            onClick={() => handleNavigation('/profile')}
            className="text-white font-medium hover:text-blue-300 transition-colors flex items-center space-x-2"
          >
            <span>{isAdmin ? '🔐' : '👤'}</span>
            <span>{isAdmin ? 'এডমিন প্রোফাইল' : 'প্রোফাইল'}</span>
          </button>
          <button
            onClick={onLogout}
            className="bg-red-500/20 hover:bg-red-500/30 text-white text-sm px-3 py-1 rounded-lg transition-colors"
          >
            লগআউট
          </button>
        </div>

        {/* Balance and Add Money - Only for regular users */}
        {!isAdmin && (
          <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg backdrop-blur-sm">
            <span className="text-white font-medium">ব্যালেন্স: {userBalance} টাকা</span>
            <button
              onClick={() => handleNavigation('/add-money')}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-white text-sm px-3 py-1 rounded-lg transition-colors"
            >
              এড মানি
            </button>
          </div>
        )}

        {/* Admin Stats - Only for admin */}
        {isAdmin && (
          <div className="mb-4 p-3 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-lg backdrop-blur-sm">
            <div className="text-white text-center">
              <div className="text-lg font-bold mb-1">এডমিন প্যানেল</div>
              <div className="text-sm text-white/80">সকল সিস্টেম নিয়ন্ত্রণ করুন</div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-2">
          {isAdmin ? (
            // Admin Menu Items
            <>
              <button
                onClick={() => onMenuClick('home')}
                className="w-full text-left p-3 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg transition-all duration-300 flex items-center space-x-3"
              >
                <span className="text-lg">🏠</span>
                <span>ড্যাশবোর্ড</span>
              </button>
              <button
                onClick={() => onMenuClick('userManagement')}
                className="w-full text-left p-3 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg transition-all duration-300 flex items-center space-x-3"
              >
                <span className="text-lg">👥</span>
                <span>ইউজার ম্যানেজমেন্ট</span>
              </button>
              <button
                onClick={() => onMenuClick('orderManagement')}
                className="w-full text-left p-3 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg transition-all duration-300 flex items-center space-x-3"
              >
                <span className="text-lg">📦</span>
                <span>অর্ডার ম্যানেজমেন্ট</span>
              </button>
              <button
                onClick={() => onMenuClick('addMoneyRequestManagement')}
                className="w-full text-left p-3 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg transition-all duration-300 flex items-center space-x-3"
              >
                <span className="text-lg">💳</span>
                <span>এড মানি রিকোয়েস্ট</span>
              </button>
            </>
          ) : (
            // Regular User Menu Items
            <>
              <button
                onClick={() => onMenuClick('home')}
                className="w-full text-left p-3 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg transition-all duration-300 flex items-center space-x-3"
              >
                <span className="text-lg">🏠</span>
                <span>হোম</span>
              </button>
              <button
                onClick={() => onMenuClick('services')}
                className="w-full text-left p-3 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg transition-all duration-300 flex items-center space-x-3"
              >
                <span className="text-lg">🚀</span>
                <span>সার্ভিস</span>
              </button>
              <button
                onClick={() => onMenuClick('orderHistory')}
                className="w-full text-left p-3 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg transition-all duration-300 flex items-center space-x-3"
              >
                <span className="text-lg">📋</span>
                <span>অর্ডার হিস্ট্রি</span>
              </button>
              <button
                onClick={() => handleNavigation('/contact')}
                className="w-full text-left p-3 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg transition-all duration-300 flex items-center space-x-3"
              >
                <span className="text-lg">📞</span>
                <span>কন্টাক্ট</span>
              </button>
              <button
                onClick={() => handleNavigation('/privacy')}
                className="w-full text-left p-3 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg transition-all duration-300 flex items-center space-x-3"
              >
                <span className="text-lg">🔒</span>
                <span>প্রাইভেসি পলিসি</span>
              </button>
            </>
          )}
        </nav>

        {/* User Info */}
        <div className="mt-4 p-3 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-lg backdrop-blur-sm">
          <div className="text-white text-sm">
            <div className="font-medium">{user.name}</div>
            <div className="text-white/70">{user.email}</div>
            {!isAdmin && <div className="text-white/70">ব্যালেন্স: {userBalance} টাকা</div>}
            {isAdmin && <div className="text-red-300 font-medium">🔐 এডমিন অ্যাকাউন্ট</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu; 