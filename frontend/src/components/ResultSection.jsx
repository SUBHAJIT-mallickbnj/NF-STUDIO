import React from 'react';
import JSZip from 'jszip'; // Import the new library

export default function ResultSection({ result }) {
  if (!result) return null;

  // --- HELPER: Convert a single table object to a CSV string ---
  const convertToCSV = (table) => {
    // 1. Extract Headers
    const headers = Array.from(table.columns);
    
    // 2. Format Rows
    const csvRows = [
      headers.join(','), // Header Row
      ...table.rows.map(row => 
        headers.map(fieldName => {
          const val = row[fieldName] || "";
          // Escape quotes if necessary (Standard CSV rule)
          return `"${val.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ];
    return csvRows.join('\n');
  };

  // --- FUNCTION 1: Download Single CSV ---
  const downloadSingleCSV = (table) => {
    const csvString = convertToCSV(table);
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${table.tableName}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // --- FUNCTION 2: Download All as ZIP ---
  const downloadAllZip = async () => {
    const zip = new JSZip();

    // Loop through all tables and add them to the zip
    result.tables.forEach((table) => {
      const csvString = convertToCSV(table);
      zip.file(`${table.tableName}.csv`, csvString);
    });

    // Generate the zip file asynchronously
    const content = await zip.generateAsync({ type: "blob" });
    
    // Trigger the download
    const url = window.URL.createObjectURL(content);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `normalized_schema_${result.target}.zip`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // --- RENDERER 1: DATA MODE (Real Tables) ---
  const renderDataResult = () => {
    return (
      <div className="space-y-6 sm:space-y-8 max-w-full overflow-hidden">
        {/* Header Section with ZIP Button */}
        <div className="text-center mb-6 sm:mb-8 relative px-2">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Normalization Result (with Data)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Target: <span className="font-bold text-purple-600">{result.target}</span>
          </p>
          
          <button
            onClick={downloadAllZip}
            className="w-full sm:w-auto px-5 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-md hover:bg-purple-700 transition flex items-center justify-center gap-2 mx-auto text-sm"
          >
            <i className="fas fa-file-archive"></i> Download All as ZIP
          </button>
        </div>

        {/* Tables Grid */}
        <div className="grid gap-6 sm:gap-8">
          {result.tables.map((table, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 w-full">
              
              {/* Table Header / Toolbar (Updated to stack on mobile devices) */}
              <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 gap-3">
                <div className="min-w-0 w-full sm:w-auto">
                  <h4 className="text-base sm:text-lg font-bold text-gray-800 truncate">{table.tableName}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 break-words mt-0.5">
                    <span className="font-medium text-gray-400 uppercase tracking-wider text-[10px] block sm:inline sm:mr-1">Columns:</span> 
                    {Array.from(table.columns).join(", ")}
                  </p>
                </div>
                <button
                  onClick={() => downloadSingleCSV(table)}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <i className="fas fa-download"></i> CSV
                </button>
              </div>

              {/* Data Grid Matrix (Responsive Cell Layout) */}
              <div className="overflow-x-auto max-h-64 border-b border-gray-100">
                <table className="w-full text-xs sm:text-sm text-left text-gray-500 min-w-[400px] sm:min-w-0">
                  <thead className="text-[11px] sm:text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
                    <tr>
                      {Array.from(table.columns).map((col) => (
                        <th key={col} className="px-3 sm:px-6 py-2.5 sm:py-3 border-b font-semibold tracking-wider">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="bg-white border-b hover:bg-gray-50 transition-colors">
                        {Array.from(table.columns).map((col) => (
                          <td key={col} className="px-3 sm:px-6 py-2 sm:py-3.5 whitespace-nowrap text-gray-600 font-normal">
                            {row[col]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {table.rows.length === 0 && (
                  <div className="p-6 text-center text-xs sm:text-sm text-gray-400">
                    No data in this table projection.
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 sm:px-6 py-2 text-[11px] sm:text-xs text-gray-500 font-medium">
                {table.rows.length} rows
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- RENDERER 2: SCHEMA MODE (Text Only) ---
  const renderSchemaResult = () => {
    const isDetection = result.highestNormalForm !== undefined;

    return (
      <div className="max-w-4xl mx-auto w-full px-1">
        {isDetection ? (
          // --- Detection Result ---
          <div className="text-center space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Analysis Report</h3>
            <div className="p-5 sm:p-6 bg-blue-50 rounded-2xl border border-blue-100 inline-block min-w-[180px]">
              <span className="text-xs sm:text-sm text-gray-600 block mb-1 font-medium tracking-wide">Highest Normal Form</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">
                {result.highestNormalForm}
              </span>
            </div>
            
            {result.candidateKeys && (
               <div className="mt-4">
                 <h4 className="text-sm sm:text-base font-semibold text-gray-700">Candidate Keys:</h4>
                 <div className="flex flex-wrap justify-center gap-2 mt-2 px-2 max-w-full">
                   {result.candidateKeys.map((key, i) => (
                     <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-mono font-bold break-all">
                       ({key.join(', ')})
                     </span>
                   ))}
                 </div>
               </div>
            )}

            {result.reasons && result.reasons.length > 0 && (
              <div className="mt-6 sm:mt-8 text-left bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mx-auto w-full max-w-2xl">
                <h4 className="font-bold text-gray-800 text-sm sm:text-base mb-3 flex items-center gap-2">
                  <i className="fas fa-exclamation-triangle text-orange-500"></i> Violations Found
                </h4>
                <ul className="space-y-2.5">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 leading-relaxed break-words">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></span>
                      <span className="flex-1">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          // --- Normalization Result (Schema) ---
          <div className="w-full">
            <div className="text-center mb-6 sm:mb-10">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-700 px-2">
                Normalization Result to {result.targetNormalForm}
              </h3>
            </div>

            {/* Notes / Logs */}
            {result.notes && result.notes.length > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg max-w-3xl mx-auto">
                <h4 className="text-sm font-bold text-yellow-800 mb-1.5 flex items-center gap-2">
                  <i className="fas fa-clipboard-list"></i> Process Log
                </h4>
                <ul className="list-disc list-inside text-xs sm:text-sm text-yellow-700 space-y-1 pl-1">
                  {result.notes.map((note, i) => (
                    <li key={i} className="break-words">{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Decomposed Tables List */}
            <div className="grid gap-4 sm:gap-6 max-w-3xl mx-auto w-full">
              {result.decomposition.map((relation, idx) => (
                <div key={idx} className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition w-full overflow-hidden">
                  <div className="flex justify-between items-center mb-4 gap-4">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{relation.name}</h4>
                    <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase flex-shrink-0 tracking-wider">
                      Table {idx + 1}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Attributes</span>
                      <div className="flex flex-wrap gap-1.5 max-w-full">
                        {Array.from(relation.attributes).map(attr => (
                          <span key={attr} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-mono border border-gray-200 max-w-full break-all">
                            {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {relation.fds && relation.fds.length > 0 && (
                       <div>
                         <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Dependencies</span>
                         <ul className="space-y-1 pl-0.5">
                           {relation.fds.map((fd, fIdx) => (
                             <li key={fIdx} className="text-xs sm:text-sm text-gray-600 font-mono break-all leading-relaxed">
                               <i className="fas fa-angle-right text-purple-400 mr-1 text-[10px]"></i>
                               <span className="font-bold text-gray-700">{Array.from(fd.lhs).join(', ')}</span> → <span>{Array.from(fd.rhs).join(', ')}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="result" className="py-8 sm:py-16 bg-gray-50 min-h-[50vh] w-full overflow-hidden">
      <div className="container mx-auto px-0 sm:px-4">
        {/* Switch Logic */}
        {result.type === 'DATA' ? renderDataResult() : renderSchemaResult()}
      </div>
    </section>
  );
}