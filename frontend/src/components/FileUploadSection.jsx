import React, { useState } from 'react';

function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && quoted && nextCharacter === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      values.push(value.trim());
      value = '';
    } else {
      value += character;
    }
  }

  values.push(value.trim());
  return values;
}

export default function FileUploadSection({ onFileSelect }) {
  const [fileName, setFileName] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file); // Pass file to parent (App.jsx)
      parseCSVPreview(file);
    }
  };

  // Simple local CSV parser for "Instant Preview"
  const parseCSVPreview = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line);
      
      if (lines.length > 0) {
        // Extract Headers (Row 1)
        const headerRow = parseCsvLine(lines[0]);
        setHeaders(headerRow);

        // Extract First 5 Rows of Data
        const previewRows = lines.slice(1, 6).map(line => {
           const values = parseCsvLine(line);
           // Map values to headers to create an object
           const rowObj = {};
           headerRow.forEach((header, index) => {
             rowObj[header] = values[index] ? values[index].trim() : "";
           });
           return rowObj;
        });
        setPreviewData(previewRows);
      }
    };
    reader.readAsText(file);
  };

  return (
    <section className="py-6 sm:py-8 bg-gray-50 border-t border-gray-200 w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
          Upload Table Data (Optional)
        </h3>

        {/* File Input Area */}
        <div className="max-w-xl mx-auto mb-6 sm:mb-8">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition px-4">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <i className="fas fa-cloud-upload-alt text-2xl sm:text-3xl text-blue-500 mb-2"></i>
              <p className="mb-1 text-xs sm:text-sm text-gray-500">
                <span className="font-semibold text-blue-600 hover:text-blue-700">Click to upload CSV</span> 
                <span className="hidden sm:inline"> or drag and drop</span>
              </p>
              <p className="text-[11px] sm:text-xs text-gray-400">CSV files only</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".csv"
              onChange={handleFileChange} 
            />
          </label>
          {fileName && (
            <p className="text-center mt-3 text-xs sm:text-sm text-green-600 font-medium break-all px-2">
              <i className="fas fa-file-csv mr-1.5 text-base"></i>Selected: {fileName}
            </p>
          )}
        </div>

        {/* Data Preview Table (Optimized Row Spacing for Mobile Devices) */}
        {previewData.length > 0 && (
          <div className="max-w-4xl mx-auto overflow-x-auto shadow-md rounded-xl border border-gray-200">
            <table className="w-full text-xs sm:text-sm text-left text-gray-500 min-w-[500px] sm:min-w-0">
              <thead className="text-[11px] sm:text-xs text-gray-700 uppercase bg-gray-200 sticky top-0">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="px-3 sm:px-6 py-2.5 sm:py-3 font-semibold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, i) => (
                  <tr key={i} className="bg-white border-b hover:bg-gray-50 transition-colors">
                    {headers.map((h, j) => (
                      <td key={j} className="px-3 sm:px-6 py-2 sm:py-4 font-normal text-gray-600 break-words">{row[h]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-center text-[10px] sm:text-xs text-gray-400 py-2 bg-gray-50 border-t border-gray-100">
              (Preview showing first 5 rows)
            </p>
          </div>
        )}
      </div>
    </section>
  );
}