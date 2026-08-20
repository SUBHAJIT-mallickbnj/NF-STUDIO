import React from 'react';

// Accept props for navigation
export default function Herosection({ onStart, onLearn }) {
  return (
    // Added responsive py-12 to ensure content has breathing room when stacked vertically on mobile
    <div className="relative bg-gray-50 overflow-hidden min-h-[85vh] flex items-center py-12 md:py-0 w-full">
      
      {/* --- Background Decorative Blobs --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 sm:w-96 h-72 sm:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
          
          {/* Left: Text Content */}
          <div className="flex-1 text-center md:text-left space-y-4 sm:space-y-6 w-full order-1">
            <div className="inline-block px-3.5 py-1 bg-blue-100 text-blue-700 font-semibold rounded-full text-xs sm:text-sm mb-1 sm:mb-2">
              🚀 Educational Platform
            </div>
            
            {/* Adjusted from text-5xl to text-4xl on mobile to prevent clipping */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Normalize Data <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Like a Pro
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Master the theory of Database Normalization. From <strong>1NF to 5NF</strong>, learn the concepts and practice with our intelligent decomposition engine.
            </p>

            {/* Responsive Buttons Layout */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start pt-2 sm:pt-4 max-w-md sm:max-w-none mx-auto md:mx-0 w-full">
              <button
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base outline-none"
              >
                Start Normalizing
              </button>
              
              <button 
                onClick={onLearn}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white text-gray-700 font-bold rounded-2xl shadow-md border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base outline-none"
              >
                <i className="fas fa-book-open text-purple-500"></i> Learn Theories
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className="pt-6 sm:pt-8 flex items-center gap-4 justify-center md:justify-start opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
              <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Powered by</span>
              <div className="flex items-center gap-4 text-xl sm:text-2xl">
                <i className="fab fa-react text-blue-400" title="React"></i>
                <i className="fab fa-java text-orange-500" title="Java 17"></i>
                <i className="fas fa-database text-gray-600" title="Relational DBMS"></i>
              </div>
            </div>
          </div>

          {/* Right: Hero Image (Tuned layout constraints for smaller displays) */}
          <div className="flex-1 w-full max-w-xs sm:max-w-md md:max-w-lg relative order-2 md:order-2 px-2 sm:px-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[1.5rem] sm:rounded-[2rem] transform rotate-3 sm:rotate-6 opacity-20 blur-lg pointer-events-none"></div>
            <img 
              src="https://img.freepik.com/free-vector/database-schema-concept-illustration_114360-7613.jpg?w=1060" 
              alt="Database Illustration" 
              className="relative rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border-2 sm:border-4 border-white z-10 w-full transform transition hover:scale-[1.01] duration-500"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}