import React from 'react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 rounded-3xl shadow-xl w-full max-w-lg mx-auto p-6 sm:p-8 text-center transform transition-all duration-300 ease-out animate-scale-in">
        <h2 className="text-3xl font-bold text-white mb-6">যোগাযোগ করুন</h2>
        <p className="text-white/80 mb-8 text-lg">
          সার্ভিস কিংবা অ্যাকাউন্ট সংক্রান্ত যেকোনো অভিযোগের জন্য নিচের মাধ্যমগুলোতে যোগাযোগ করুন। ধন্যবাদ।
        </p>
        <div className="space-y-5">
          <a 
            href="https://wa.me/01829534989" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="glass-button w-full flex items-center justify-center space-x-3 py-3 rounded-lg text-white font-semibold"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.77.47 3.45 1.37 4.95L2.07 22l5.25-1.37c1.45.8 3.1.99 4.67.99 5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zm5.55 14.59c-.27.7-.9.94-1.55.7l-1.68-.83c-.3-.15-.55-.13-.76.06-.2.19-.48.5-.66.69-.18.19-.34.21-.63.09-.3-.12-1.26-.47-2.4-1.48-1.74-1.5-2.9-3.47-3.23-4.01-.33-.54-.03-.84.22-1.07l.47-.55c.2-.2.24-.3.32-.47.08-.17.04-.32-.02-.45-.06-.13-.55-1.3-.76-1.8-.2-.5-.4-.42-.5-.43-.1-.01-.22-.01-.4-.01h-.44c-.2-.01-.52.06-.8.34-.27.28-1.04 1.02-1.04 2.47 0 1.45 1.07 2.85 1.22 3.03.15.18 2.1 3.2 5.1 4.54 2.37 1.08 3.32.93 3.98.85.67-.09 1.57-.64 1.8-1.08.23-.43.23-.8.16-1.08-.07-.28-.27-.45-.55-.58z"/>
            </svg>
            <span>WhatsApp</span>
          </a>
          <a 
            href="https://t.me/Elite_Services_APP" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="glass-button w-full flex items-center justify-center space-x-3 py-3 rounded-lg text-white font-semibold"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.17 7.02l-2.47 1.18c-.14.07-.3.04-.42-.08-.12-.12-.15-.28-.08-.42l1.18-2.47c.18-.38-.01-.8-.43-.91l-7.7-2.02c-.44-.12-.87.16-.95.6l-1.32 6.03c-.1.45.19.9.64.97l.08.01c.21.03.42-.02.58-.16l2.12-1.78c.17-.14.41-.12.55.05l.93.93c.14.14.34.17.5.07l.08-.05c.34-.2.83-.5.98-.6.15-.1.3-.12.44-.05l.07.03c.27.13.56.2.86.2l.09.01c.45.07.82-.23.86-.68l.4-2.58z"/>
            </svg>
            <span>Telegram</span>
          </a>
          <a 
            href="mailto:our.app.elite@tapi.re" 
            className="glass-button w-full flex items-center justify-center space-x-3 py-3 rounded-lg text-white font-semibold"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>ইমেইল</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 