import React from 'react';

export default function Feature() {
  // Hardcoded full Tailwind classes so the production compiler never purges them
  const features = [
    {
      icon: "fa-magic",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      gradLine: "from-blue-400 to-blue-600",
      title: "Auto-Detection",
      desc: "Instantly analyze your schema to detect existing normal forms and violations."
    },
    {
      icon: "fa-project-diagram",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      gradLine: "from-purple-400 to-purple-600",
      title: "Visual Decomposition",
      desc: "See how your tables split into BCNF, 4NF, and 5NF with clear dependency tracking."
    },
    {
      icon: "fa-file-csv",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      gradLine: "from-green-400 to-green-600",
      title: "Real Data Import",
      desc: "Don't just guess. Upload actual CSV files and see the data physically separated."
    },
    {
      icon: "fa-download",
      bgColor: "bg-pink-100",
      textColor: "text-pink-600",
      gradLine: "from-pink-400 to-pink-600",
      title: "Export Ready",
      desc: "Download your normalized schema as SQL scripts or CSV files in one click."
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-20 bg-white relative w-full overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Header Block (Tuned sizing metrics for mobile viewports) */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-1">
          <h2 className="text-xs sm:text-base text-blue-600 font-bold tracking-widest uppercase">
            Why Use This Tool?
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Everything you need to master Database Design
          </p>
          <p className="mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg lg:text-xl text-gray-500 mx-auto leading-relaxed">
            A complete suite for students and developers to visualize and implement database normalization.
          </p>
        </div>

        {/* Feature Cards Grid Map */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100/80 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-start w-full"
            >
              {/* Icon Container (Using static safe text/bg mappings) */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${feature.bgColor} ${feature.textColor} flex items-center justify-center text-xl sm:text-2xl mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                <i className={`fas ${feature.icon}`}></i>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-1">
                {feature.desc}
              </p>
              
              {/* Decorative gradient line at bottom */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradLine} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}