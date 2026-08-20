import React, { useState } from 'react';

export default function LearnSection() {
  const [activeTab, setActiveTab] = useState('theory'); // 'theory' or 'guide'

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden w-full">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-6 tracking-tight leading-tight">
            Database <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Mastery Hub</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Switch between learning the core **Theory** and mastering the **Practical Tool**.
          </p>
          
          {/* Custom Toggle Switch (Updated to fit mobile form factors smoothly) */}
          <div className="flex justify-center mt-6 sm:mt-10 px-1 w-full">
            <div className="bg-white p-1.5 rounded-2xl shadow-inner border border-gray-200 inline-flex relative w-full max-w-md sm:w-auto">
              {/* The Sliding Background */}
              <div 
                className="absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow transition-all duration-300 ease-out"
                style={{
                  left: activeTab === 'theory' ? '0.375rem' : '50%',
                  width: 'calc(50% - 0.375rem)',
                }}
              ></div>
              
              {/* Button 1: Theory */}
              <button
                onClick={() => setActiveTab('theory')}
                className={`relative z-10 flex-1 sm:w-56 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-300 text-center outline-none focus:outline-none ${
                  activeTab === 'theory' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fas fa-graduation-cap mr-1.5 sm:mr-2"></i> Theory
              </button>

              {/* Button 2: Guide */}
              <button
                onClick={() => setActiveTab('guide')}
                className={`relative z-10 flex-1 sm:w-56 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-300 text-center outline-none focus:outline-none ${
                  activeTab === 'guide' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fas fa-map mr-1.5 sm:mr-2"></i> User Guide
              </button>
            </div>
          </div>
        </div>

        {/* Content Area with Animation */}
        <div className="animate-fade-in-up w-full">
          {activeTab === 'theory' ? <TheoryContent /> : <GuideContent />}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Theory (Cards with Safe Theme Maps) ---
function TheoryContent() {
  const levels = [
    {
      nf: "1NF",
      title: "First Normal Form",
      goal: "Atomicity",
      desc: "Eliminate repeating groups. Ensure every cell contains a single value.",
      icon: "fa-layer-group",
      styles: {
        gradBar: "from-blue-400 to-blue-600",
        iconBg: "bg-blue-50",
        iconText: "text-blue-600",
        badge: "bg-blue-100 text-blue-700"
      }
    },
    {
      nf: "2NF",
      title: "Second Normal Form",
      goal: "No Partial Dependency",
      desc: "Ensure all non-key columns depend on the WHOLE primary key, not just part of it.",
      icon: "fa-columns",
      styles: {
        gradBar: "from-indigo-400 to-indigo-600",
        iconBg: "bg-indigo-50",
        iconText: "text-indigo-600",
        badge: "bg-indigo-100 text-indigo-700"
      }
    },
    {
      nf: "3NF",
      title: "Third Normal Form",
      goal: "No Transitive Dependency",
      desc: "Columns shouldn't depend on other non-key columns. (A -> B -> C is bad).",
      icon: "fa-project-diagram",
      styles: {
        gradBar: "from-purple-400 to-purple-600",
        iconBg: "bg-purple-50",
        iconText: "text-purple-600",
        badge: "bg-purple-100 text-purple-700"
      }
    },
    {
      nf: "BCNF",
      title: "Boyce-Codd NF",
      goal: "Strict 3NF",
      desc: "A stricter version of 3NF. For every dependency X -> Y, X must be a Super Key.",
      icon: "fa-shield-alt",
      styles: {
        gradBar: "from-pink-400 to-pink-600",
        iconBg: "bg-pink-50",
        iconText: "text-pink-600",
        badge: "bg-pink-100 text-pink-700"
      }
    },
    {
      nf: "4NF",
      title: "Fourth Normal Form",
      goal: "No Multi-valued Dependency",
      desc: "Separate independent multi-valued facts (e.g., Hobbies and Skills) into different tables.",
      icon: "fa-code-branch",
      styles: {
        gradBar: "from-rose-400 to-rose-600",
        iconBg: "bg-rose-50",
        iconText: "text-rose-600",
        badge: "bg-rose-100 text-rose-700"
      }
    },
    {
      nf: "5NF",
      title: "Fifth Normal Form",
      goal: "Join Dependency",
      desc: "Ensure data can be reconstructed from smaller tables without losing information.",
      icon: "fa-network-wired",
      styles: {
        gradBar: "from-orange-400 to-orange-600",
        iconBg: "bg-orange-50",
        iconText: "text-orange-600",
        badge: "bg-orange-100 text-orange-700"
      }
    }
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
      {levels.map((level, idx) => (
        <div key={idx} className="group relative bg-white rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100/80 hover:-translate-y-1.5 overflow-hidden flex flex-col items-start w-full">
          {/* Top Gradient Bar */}
          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${level.styles.gradBar}`}></div>
          
          <div className="flex justify-between items-center mb-5 sm:mb-6 w-full">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${level.styles.iconBg} ${level.styles.iconText} flex items-center justify-center text-xl sm:text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
              <i className={`fas ${level.icon}`}></i>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${level.styles.badge} flex-shrink-0`}>
              {level.nf}
            </span>
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
            {level.title}
          </h3>
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Goal: {level.goal}
          </p>
          
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-1">
            {level.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

// --- SUB-COMPONENT: User Guide (Timeline with Safe Mappings) ---
function GuideContent() {
  const steps = [
    {
      num: "01",
      title: "Define the Schema",
      desc: "Start by entering your Table Name and Columns. Identify your Primary Key (e.g., 'id').",
      icon: "fa-keyboard",
      tip: "Use commas to separate columns!",
      styles: {
        gradNode: "from-blue-500 to-blue-600",
        mobileBg: "bg-blue-100 text-blue-600",
        tipContainer: "bg-blue-50 border-blue-500",
        tipIcon: "text-blue-500",
        tipHeading: "text-blue-600",
        tipText: "text-blue-800"
      }
    },
    {
      num: "02",
      title: "Set Dependencies",
      desc: "Tell the system the rules of your data. A -> B means 'A determines B'. For 4NF, use the Multivalued section.",
      icon: "fa-random",
      tip: "Functional Dependencies are crucial for BCNF.",
      styles: {
        gradNode: "from-indigo-500 to-indigo-600",
        mobileBg: "bg-indigo-100 text-indigo-600",
        tipContainer: "bg-indigo-50 border-indigo-500",
        tipIcon: "text-indigo-500",
        tipHeading: "text-indigo-600",
        tipText: "text-indigo-800"
      }
    },
    {
      num: "03",
      title: "Upload Real Data",
      desc: "Optional but recommended! Upload a CSV file. The system will preview it instantly.",
      icon: "fa-cloud-upload-alt",
      tip: "Your CSV headers must match your Column names.",
      styles: {
        gradNode: "from-purple-500 to-purple-600",
        mobileBg: "bg-purple-100 text-purple-600",
        tipContainer: "bg-purple-50 border-purple-500",
        tipIcon: "text-purple-500",
        tipHeading: "text-purple-600",
        tipText: "text-purple-800"
      }
    },
    {
      num: "04",
      title: "Analyze & Normalize",
      desc: "Click 'Normalize'. The engine will decompose your table into smaller, efficient tables.",
      icon: "fa-magic",
      tip: "You can choose target forms like 3NF or BCNF.",
      styles: {
        gradNode: "from-pink-500 to-pink-600",
        mobileBg: "bg-pink-100 text-pink-600",
        tipContainer: "bg-pink-50 border-pink-500",
        tipIcon: "text-pink-500",
        tipHeading: "text-pink-600",
        tipText: "text-pink-800"
      }
    },
    {
      num: "05",
      title: "Export Results",
      desc: "View your new tables in the grid and download them individually or as a ZIP archive.",
      icon: "fa-download",
      tip: "Ready for SQL import!",
      styles: {
        gradNode: "from-green-500 to-green-600",
        mobileBg: "bg-green-100 text-green-600",
        tipContainer: "bg-green-50 border-green-500",
        tipIcon: "text-green-500",
        tipHeading: "text-green-600",
        tipText: "text-green-800"
      }
    }
  ];

  return (
    <div className="max-w-4xl mx-auto w-full px-1">
      <div className="relative w-full">
        {/* Vertical Line (The Roadmap - hidden correctly on mobile viewports) */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-gray-100 rounded-full hidden md:block pointer-events-none"></div>

        <div className="space-y-6 sm:space-y-12 w-full">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col md:flex-row gap-4 md:gap-8 items-start group w-full">
              
              {/* The Timeline Node (Desktop Icon Display) */}
              <div className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-full bg-white border-4 border-white shadow-xl items-center justify-center z-10 relative">
                 <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.styles.gradNode} flex items-center justify-center text-white text-xl`}>
                   <i className={`fas ${step.icon}`}></i>
                 </div>
              </div>

              {/* The Content Card */}
              <div className="flex-1 w-full bg-white rounded-3xl p-5 sm:p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden">
                {/* Background Number */}
                <div className="absolute -right-4 -top-6 text-7xl sm:text-9xl font-black text-gray-50 opacity-60 z-0 select-none pointer-events-none">
                  {step.num}
                </div>

                <div className="relative z-10 w-full">
                  {/* Mobile Header Accent Node */}
                  <div className="flex items-center gap-2.5 mb-3 md:hidden">
                    <div className={`w-9 h-9 rounded-full ${step.styles.mobileBg} flex items-center justify-center text-sm flex-shrink-0`}>
                       <i className={`fas ${step.icon}`}></i>
                    </div>
                    <span className="font-bold text-xs text-gray-400 uppercase tracking-wider">Step {step.num}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                    {step.desc}
                  </p>

                  {/* Pro Tip Box (Secured styling from purging) */}
                  <div className={`border-l-4 p-3.5 sm:p-4 rounded-r-xl ${step.styles.tipContainer}`}>
                    <div className="flex items-start gap-3">
                      <i className={`fas fa-lightbulb mt-1 text-xs sm:text-sm ${step.styles.tipIcon}`}></i>
                      <div>
                        <span className={`block text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-0.5 ${step.styles.tipHeading}`}>Pro Tip</span>
                        <span className={`text-xs sm:text-sm leading-relaxed ${step.styles.tipText}`}>{step.tip}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}