import React, { useState } from 'react';

// Receives 'setCurrentView' from App.jsx to change pages
export default function Navbar({ currentView, setCurrentView }) {
  // Added local state to track if mobile drawer menu is open
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: 'fa-home' },
    { id: 'tool', label: 'Start Normalizing', icon: 'fa-magic' }, // The main tool
    { id: 'learn', label: 'Learn & Guide', icon: 'fa-book-open' }, // The learn section
  ];

  // Helper to change pages and automatically snap the mobile menu closed
  const handleMobileNavClick = (viewId) => {
    setCurrentView(viewId);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50 transition-all duration-300 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- LOGO SECTION --- */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleMobileNavClick('home')}
          >
            {/* Animated Icon Box */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0">
              <i className="fas fa-database text-lg"></i>
            </div>
            
            {/* Text */}
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 tracking-tight leading-none">
                NF STUDIO
              </span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest hidden sm:block mt-0.5">
                Normalizer Tool
              </span>
            </div>
          </div>

          {/* --- DESKTOP NAVIGATION (Awesome Buttons) --- */}
          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`
                    relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 outline-none
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/40 transform -translate-y-0.5' 
                      : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                    }
                  `}
                >
                  <i className={`fas ${item.icon} ${isActive ? 'animate-pulse' : ''}`}></i>
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* --- MOBILE MENU BUTTON (Fixed Interaction) --- */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition outline-none focus:outline-none"
              aria-label="Toggle Menu"
            >
              {/* Icon alters dynamically depending on open/close state status */}
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl transition-all duration-200`}></i>
            </button>
          </div>

        </div>
      </div>

      {/* --- MOBILE DROPDOWN DRAWER (New Responsive Layout Component) --- */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2 animate-fade-in shadow-inner max-w-full overflow-hidden">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleMobileNavClick(item.id)}
                className={`
                  w-full px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all duration-200 text-left outline-none
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }
                `}
              >
                <i className={`fas ${item.icon} w-5 text-center ${isActive ? 'text-white' : 'text-gray-400'}`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}