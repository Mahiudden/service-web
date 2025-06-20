import { useState, useEffect } from 'react';
import Header from './Header';
import HamburgerMenu from './HamburgerMenu';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement.jsx';
import AddMoneyRequestManagement from './AddMoneyRequestManagement.jsx';
import ServiceManagement from './ServiceManagement.jsx';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AdminPanel = ({ user, onLogout }) => {
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [currentAdminView, setCurrentAdminView] = useState('home');
  const [stats, setStats] = useState({
    totalUsers: 'Loading...',
    todayOrders: 'Loading...',
    totalRevenue: 'Loading...',
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await adminAPI.getDashboardStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setStatsError('Failed to load stats');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const handleMenuClick = (view) => {
    setCurrentAdminView(view);
    setShowHamburgerMenu(false);
  };

  const renderAdminContent = () => {
    switch (currentAdminView) {
      case 'userManagement':
        return <UserManagement />;
      case 'orderManagement':
        return <OrderManagement />;
      case 'addMoneyRequestManagement':
        return <AddMoneyRequestManagement />;
      case 'serviceManagement':
        return <ServiceManagement />;
      default:
        return (
          <div className="space-y-8">
            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 text-center">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-2xl font-bold text-white">
                  {loadingStats ? 'Loading...' : statsError ? 'Error' : stats.totalUsers}+
                </div>
                <div className="text-white/70">মোট ইউজার</div>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-white">
                  {loadingStats ? 'Loading...' : statsError ? 'Error' : stats.todayOrders}+
                </div>
                <div className="text-white/70">আজকের অর্ডার</div>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-white">
                  {loadingStats ? 'Loading...' : statsError ? 'Error' : stats.totalRevenue.toLocaleString('bn-BD')} টাকা
                </div>
                <div className="text-white/70">মোট আয়</div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                className="service-card text-center cursor-pointer group"
                onClick={() => setCurrentAdminView('userManagement')}
              >
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-white mb-2">ইউজার ম্যানেজমেন্ট</h3>
                <p className="text-white/80 text-sm mb-4">ইউজার অ্যাকাউন্ট নিয়ন্ত্রণ করুন</p>
                <div className="text-blue-300 group-hover:text-blue-200 transition-colors">
                  <span className="text-sm font-medium">ম্যানেজ করুন</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
              
              <div
                className="service-card text-center cursor-pointer group"
                onClick={() => setCurrentAdminView('orderManagement')}
              >
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-white mb-2">অর্ডার ম্যানেজমেন্ট</h3>
                <p className="text-white/80 text-sm mb-4">অর্ডার বাতিল বা কনফার্ম করুন</p>
                <div className="text-blue-300 group-hover:text-blue-200 transition-colors">
                  <span className="text-sm font-medium">ম্যানেজ করুন</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
              
              <div
                className="service-card text-center cursor-pointer group"
                onClick={() => setCurrentAdminView('addMoneyRequestManagement')}
              >
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-bold text-white mb-2">এড মানি রিকোয়েস্ট</h3>
                <p className="text-white/80 text-sm mb-4">এড মানি রিকোয়েস্ট গ্রহণ বা বাতিল করুন</p>
                <div className="text-blue-300 group-hover:text-blue-200 transition-colors">
                  <span className="text-sm font-medium">ম্যানেজ করুন</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
              <div
                className="service-card text-center cursor-pointer group"
                onClick={() => setCurrentAdminView('serviceManagement')}
              >
                <div className="text-4xl mb-4">🛠️</div>
                <h3 className="text-xl font-bold text-white mb-2">সার্ভিস ম্যানেজমেন্ট</h3>
                <p className="text-white/80 text-sm mb-4">সার্ভিস এডিট, ডিলিট, ও নতুন সার্ভিস যোগ করুন</p>
                <div className="text-blue-300 group-hover:text-blue-200 transition-colors">
                  <span className="text-sm font-medium">ম্যানেজ করুন</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <Header 
        onHamburgerClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
        showHamburgerMenu={showHamburgerMenu}
      />

      {showHamburgerMenu && (
        <HamburgerMenu
          user={user}
          userBalance={user.balance || 0}
          onLogout={onLogout}
          onAddMoney={() => {}}
          onProfile={() => navigate('/profile')}
          onMenuClick={handleMenuClick}
          onClose={() => setShowHamburgerMenu(false)}
          isAdmin={true}
        />
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Admin Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 rounded-full bg-gradient-to-r from-red-500/30 to-purple-500/30 backdrop-blur-sm mb-4">
            <span className="text-5xl">🔐</span>
          </div>
          <h2 className="text-4xl font-bold gradient-text mb-4">এডমিন প্যানেল</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Elite Services এর এডমিন প্যানেলে স্বাগতম। 
            সকল ইউজার, অর্ডার এবং রিকোয়েস্ট নিয়ন্ত্রণ করুন।
          </p>
        </div>

        {/* Navigation Breadcrumb */}
        {currentAdminView !== 'home' && (
          <div className="mb-6">
            <button
              onClick={() => setCurrentAdminView('home')}
              className="glass-button flex items-center space-x-2 group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>পিছনে যান</span>
            </button>
          </div>
        )}

        {renderAdminContent()}
      </div>
    </div>
  );
};

export default AdminPanel; 