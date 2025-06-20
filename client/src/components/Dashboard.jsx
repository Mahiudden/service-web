import { useState } from 'react';
import Header from './Header';
import HamburgerMenu from './HamburgerMenu';
import Services from './Services';
import OrderHistory from './OrderHistory';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [userBalance, setUserBalance] = useState(user.balance || 0);
  const navigate = useNavigate();

  const handleAddMoney = (amount) => {
    setUserBalance(prev => prev + amount);
  };

  const handleMenuClick = (view) => {
    setCurrentView(view);
    setShowHamburgerMenu(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'services':
        return <Services userBalance={userBalance} setUserBalance={setUserBalance} />;
      case 'orderHistory':
        return <OrderHistory />;
      case 'contact':
        navigate('/contact');
        return null;
      case 'privacy':
        navigate('/privacy');
        return null;
      default:
        return <Services userBalance={userBalance} setUserBalance={setUserBalance} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <Header 
        onHamburgerClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
        showHamburgerMenu={showHamburgerMenu}
      />

      {showHamburgerMenu && (
        <HamburgerMenu
          user={user}
          userBalance={userBalance}
          onLogout={onLogout}
          onAddMoney={() => navigate('/add-money')}
          onProfile={() => navigate('/profile')}
          onMenuClick={handleMenuClick}
          onClose={() => setShowHamburgerMenu(false)}
        />
      )}

      {/* Enhanced Notice Bar */}
      <div className="relative bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border-b border-yellow-500/30 py-3 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent animate-pulse"></div>
        <div className="slide-notice text-yellow-200 text-center font-medium relative z-10">
          <span className="inline-flex items-center space-x-2">
            <span className="text-lg">⏰</span>
            <span>আমাদের সকল সার্ভিস সকাল ১০টা থেকে রাত ১০ টা পর্যন্ত চালু থাকবে</span>
            <span className="text-lg">⏰</span>
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {currentView === 'home' && (
          <div className="text-center mb-12 space-y-6">
            {/* Hero Section */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold gradient-text">Elite Services</h2>
              <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
                আপনার প্রয়োজনীয় সকল ডিজিটাল সার্ভিস পেতে আমাদের সাথে থাকুন। 
                নিরাপদ, দ্রুত এবং বিশ্বস্ত সেবা দিয়ে আমরা আপনার ডিজিটাল জীবন সহজ করে তুলছি।
              </p>
            </div>

            <div className="pt-8">
              <h3 className="text-3xl font-bold gradient-text mb-4">OUR SERVICES</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard; 