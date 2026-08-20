import React from 'react';

// Receives 'setCurrentView' from App.jsx to change pages
export default function Footer({ setCurrentView }) {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 border-t border-slate-800 relative overflow-hidden w-full">
      
      {/* Decorative background glow - kept subtle and safe from layout breakages */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full">
        
        {/* TOP SECTION: Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-8 w-full">
          
          {/* COLUMN 1: Brand & Desc (Spans 5 columns on large displays) */}
          <div className="lg:col-span-5 space-y-4 w-full">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 flex-shrink-0">
                <i className="fas fa-database text-sm"></i>
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                NF STUDIO
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              An advanced educational platform designed to simplify database normalization. 
              Master concepts from 1NF to 5NF with real-time visualization.
            </p>
            <div className="flex gap-3 pt-1">
              {/* Compact Social Icons with Enhanced Hover Interactivity */}
              <a 
                href="https://github.com/SUBHAJIT-mallickbnj" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm outline-none"
              >
                <i className="fab fa-github"></i>
              </a>
              <a 
                href="https://www.linkedin.com/in/subhajit-mallick-345113241" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white transition-all duration-300 text-sm outline-none"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a 
                href="mailto:subhajitmallick2004.it.aec@gmail.com" 
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white transition-all duration-300 text-sm outline-none"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>

          {/* COLUMN 2: Navigation */}
          <div className="lg:col-span-2 lg:col-start-7 sm:pt-2 w-full">
            <h4 className="text-white font-bold mb-3.5 uppercase tracking-wider text-xs">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-blue-400 transition-colors flex items-center gap-2 outline-none py-0.5">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('tool')} className="hover:text-blue-400 transition-colors flex items-center gap-2 outline-none py-0.5 text-left">
                  Normalizer Tool
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('learn')} className="hover:text-blue-400 transition-colors flex items-center gap-2 outline-none py-0.5 text-left">
                  Theory & Guide
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Tech Stack */}
          <div className="lg:col-span-2 sm:pt-2 w-full">
            <h4 className="text-white font-bold mb-3.5 uppercase tracking-wider text-xs">Tech Stack</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-400 py-0.5">
                <i className="fab fa-react text-blue-400 text-xs w-4 text-center"></i> React.js
              </li>
              <li className="flex items-center gap-2 text-slate-400 py-0.5">
                <i className="fab fa-java text-orange-500 text-xs w-4 text-center"></i> Spring Boot
              </li>
              <li className="flex items-center gap-2 text-slate-400 py-0.5">
                <i className="fas fa-wind text-cyan-400 text-xs w-4 text-center"></i> Tailwind CSS
              </li>
            </ul>
          </div>

          {/* COLUMN 4: Project Info (Compact Adaptive Card) */}
          <div className="lg:col-span-2 sm:pt-2 w-full">
            <h4 className="text-white font-bold mb-3.5 uppercase tracking-wider text-xs">Project Info</h4>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 max-w-xs sm:max-w-full">
              <p className="text-[10px] text-slate-400 mb-1 uppercase font-bold tracking-wider">Final Year Project</p>
              <p className="text-white font-extrabold text-sm tracking-tight">SUBHAJIT MALLICK</p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">INFORMATION TECHNOLOGY</p>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Copyright & Legal Bars */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] sm:text-xs text-slate-500 text-center md:text-left w-full">
          <p>&copy; {new Date().getFullYear()} NF STUDIO. Deployed for Academics.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-medium">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
          </div>
        </div>

      </div>
    </footer>
  );
}