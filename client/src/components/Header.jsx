const Header = ({ onHamburgerClick, showHamburgerMenu }) => {
  return (
    <header className="glass-card border-b border-white/20 sticky top-0 z-30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Site Name with Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Elite Services
              </h1>
              <p className="text-white/60 text-xs">Premium Digital Services</p>
            </div>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={onHamburgerClick}
            className="glass-button p-3 rounded-xl relative overflow-hidden group"
            aria-label="Menu"
          >
            <div className="flex flex-col space-y-1 items-center justify-center">
              <span 
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  showHamburgerMenu ? 'rotate-45 translate-y-1.5' : ''
                }`}
              ></span>
              <span 
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  showHamburgerMenu ? 'opacity-0' : ''
                }`}
              ></span>
              <span 
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  showHamburgerMenu ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              ></span>
            </div>
            
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 