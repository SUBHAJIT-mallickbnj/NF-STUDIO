import React, { useState } from 'react';

export default function AnalysisSection({ onDetect, onNormalize, loading, schema }) {
  const [targetForm, setTargetForm] = useState("3NF");

  const handleDetectClick = () => {
    onDetect(schema);
  };

  const handleNormalizeClick = () => {
    onNormalize(schema, targetForm);
  };

  return (
    <section id="analysis" className="py-8 sm:py-16 bg-gray-100 w-full overflow-hidden rounded-2xl border border-gray-200/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          Run Analysis & Normalization
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8">
          Once your table structure is defined, click the buttons below to analyze its normal form or perform a full normalization.
        </p>
        
        {/* Outer Flex Box: Stacks all 3 elements independently on mobile, rows up on desktop */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md sm:max-w-none mx-auto w-full px-2 sm:px-0">
          
          {/* Element 1: Detect Normal Form Button */}
          <button
            onClick={handleDetectClick}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-700 transition disabled:bg-gray-400 text-sm shadow-md outline-none flex-shrink-0"
          >
            {loading ? 'Analyzing...' : 'Detect Normal Form'}
          </button>
          
          {/* Element 2: Target Selection Dropdown (Standalone centered pill block on mobile) */}
          <select
            value={targetForm}
            onChange={(e) => setTargetForm(e.target.value)}
            className="w-full max-w-[200px] sm:w-28 px-4 py-3.5 border border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-bold text-gray-700 shadow-sm outline-none cursor-pointer text-center"
          >
            <option value="1NF">1NF</option>
            <option value="2NF">2NF</option>
            <option value="3NF">3NF</option>
            <option value="BCNF">BCNF</option>
            <option value="4NF">4NF</option>
            <option value="5NF">5NF</option>
          </select>
          
          {/* Element 3: Normalize to Target Button (Matches top button dimension boundaries) */}
          <button
            onClick={handleNormalizeClick}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-bold bg-purple-600 hover:bg-purple-700 transition disabled:bg-gray-400 text-sm shadow-md outline-none text-center"
          >
            {loading ? 'Normalizing...' : 'Normalize to Target'}
          </button>

        </div>
      </div>
    </section>
  );
}