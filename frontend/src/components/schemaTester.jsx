import React, { useState } from "react";
import { detectNormalForm, normalizeTo } from "../api/normService";

function normalizePrimaryKey(pk) {
  if (!pk) return undefined;
  if (Array.isArray(pk)) {
    return pk.flatMap(item =>
      String(item).split(",").map(s => s.trim()).filter(Boolean)
    );
  }
  return String(pk).includes(",")
    ? String(pk).split(",").map(s => s.trim()).filter(Boolean)
    : String(pk).split(/\s+/).map(s => s.trim()).filter(Boolean);
}

const SchemaTester = () => {
  const [input, setInput] = useState(`{
  "tableName": "Student",
  "attributes": ["A", "B", "C", "D"],
  "primaryKey": ["A", "B"],
  "functionalDependencies": [
    { "lhs": ["A","B"], "rhs": ["C"] },
    { "lhs": ["C"], "rhs": ["D"] }
  ]
}`);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

  const handleDetect = async () => {
    try {
      const payload = JSON.parse(input);
      if (payload.primaryKey) {
        payload.primaryKey = normalizePrimaryKey(payload.primaryKey);
      }
      const res = await detectNormalForm(payload);
      setOutput(res);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNormalize = async () => {
    try {
      const payload = JSON.parse(input);
      if (payload.primaryKey) {
        payload.primaryKey = normalizePrimaryKey(payload.primaryKey);
      }
      const res = await normalizeTo(payload, "3NF");
      setOutput(res);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto w-full overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100 my-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i className="fas fa-terminal text-blue-600 text-lg"></i> Schema Sandbox Tester
      </h2>
      
      <div className="space-y-5">
        {/* Input JSON Console Area */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Input JSON Schema Payload
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={11}
            className="w-full p-4 font-mono text-xs sm:text-sm bg-gray-900 text-emerald-400 rounded-xl shadow-inner border border-gray-800 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed transition"
            placeholder="Enter JSON payload here..."
          />
        </div>

        {/* Action Controls: Combines vertical stack configurations for mobile devices */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button 
            onClick={handleDetect}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-colors outline-none flex items-center justify-center gap-2"
          >
            <i className="fas fa-search text-[11px]"></i> Detect Normal Form
          </button>
          <button 
            onClick={handleNormalize}
            className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-colors outline-none flex items-center justify-center gap-2"
          >
            <i className="fas fa-bolt text-[11px]"></i> Normalize to 3NF
          </button>
        </div>

        {/* Error Messaging Banner Panel */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs sm:text-sm font-semibold break-all flex items-start gap-2">
            <i className="fas fa-exclamation-circle mt-0.5 flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Output Console Log Panel */}
        {output && (
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Execution Trace Output Log
            </label>
            <pre className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-mono text-xs text-gray-700 overflow-x-auto max-w-full shadow-inner whitespace-pre-wrap sm:whitespace-pre leading-relaxed">
              {JSON.stringify(output, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaTester;