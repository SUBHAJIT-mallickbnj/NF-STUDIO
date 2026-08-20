import React, { useState } from "react";

export default function InputSectionWithPreview() {
  const [tableName, setTableName] = useState("Employees");
  const [primaryKey, setPrimaryKey] = useState("employee_id");
  const [columns, setColumns] = useState(["employee_id", "name", "email", "department_id"]);
  const [newColumn, setNewColumn] = useState("");

  // Functional Dependencies (split into lhs & rhs)
  const [dependencies, setDependencies] = useState([
    { lhs: "department_id", rhs: "department_name" },
    { lhs: "manager_id", rhs: "manager_name" },
  ]);
  const [newLHS, setNewLHS] = useState("");
  const [newRHS, setNewRHS] = useState("");

  // Target Normal Form
  const [targetForm, setTargetForm] = useState("3NF");

  // Column functions
  const handleAddColumn = () => {
    const trimmed = newColumn.trim();
    if (trimmed && !columns.includes(trimmed)) {
      setColumns([...columns, trimmed]);
      setNewColumn("");
    }
  };
  const handleRemoveColumn = (col) => setColumns(columns.filter((c) => c !== col));

  // Dependency functions
  const handleAddDependency = () => {
    const lhsTrim = newLHS.trim();
    const rhsTrim = newRHS.trim();
    if (lhsTrim && rhsTrim) {
      setDependencies([...dependencies, { lhs: lhsTrim, rhs: rhsTrim }]);
      setNewLHS("");
      setNewRHS("");
    }
  };
  const handleRemoveDependency = (index) => {
    setDependencies(dependencies.filter((_, i) => i !== index));
  };

  // Analyze button
  const handleAnalyze = () => {
    console.log({ tableName, primaryKey, columns, dependencies, targetForm });
    alert(`Normalization analysis triggered for ${targetForm}! Check console.`);
  };

  // Function to determine bullet color
  const getColumnColor = (col) => {
    if (col === primaryKey) return "bg-green-500"; // Primary key
    else if (dependencies.some((d) => d.lhs === col)) return "bg-purple-500"; // referenced in dependencies
    else return "bg-blue-500"; // Regular column
  };

  return (
    <section id="input" className="py-8 sm:py-16 bg-white w-full overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Define Your Table Structure</h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto px-2">
            Input your current database table information and see live preview.
          </p>
        </div>

        {/* Core Layout Wrapper */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start w-full">
          
          {/* Left: Form Panel (Updated padding profiles for small screens) */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-8 shadow-lg space-y-5 sm:space-y-6 w-full overflow-hidden">
            
            {/* Table Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Table Name</label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm sm:text-base outline-none transition"
              />
            </div>

            {/* Primary Key */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Primary Key</label>
              <input
                type="text"
                value={primaryKey}
                onChange={(e) => setPrimaryKey(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm sm:text-base outline-none transition"
              />
            </div>

            {/* Columns Fields */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Columns</label>
              <div className="flex items-center gap-2 mb-3 w-full">
                <input
                  type="text"
                  value={newColumn}
                  onChange={(e) => setNewColumn(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                  className="w-full min-w-0 flex-1 px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm sm:text-base outline-none transition"
                  placeholder="Add column name"
                />
                <button
                  type="button"
                  onClick={handleAddColumn}
                  className="w-12 h-10 sm:h-12 rounded-xl text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition shadow-md flex-shrink-0"
                >
                  <i className="fas fa-plus text-sm"></i>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 max-w-full">
                {columns.map((col) => (
                  <span
                    key={col}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold break-all"
                  >
                    {col}
                    <button
                      type="button"
                      onClick={() => handleRemoveColumn(col)}
                      className="ml-1 text-blue-500 hover:text-blue-900 font-bold focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Dependencies (Updated to prevent row-squeezing on mobile viewports) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Dependencies</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 w-full">
                <div className="flex items-center gap-2 flex-1 min-w-0 w-full">
                  <input
                    type="text"
                    value={newLHS}
                    onChange={(e) => setNewLHS(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddDependency()}
                    className="w-full min-w-0 flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 text-sm sm:text-base outline-none transition"
                    placeholder="LHS (determinant)"
                  />
                  <span className="text-gray-400 font-bold flex-shrink-0">&rarr;</span>
                  <input
                    type="text"
                    value={newRHS}
                    onChange={(e) => setNewRHS(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddDependency()}
                    className="w-full min-w-0 flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 text-sm sm:text-base outline-none transition"
                    placeholder="RHS (dependent)"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddDependency}
                  className="w-full sm:w-12 h-10 sm:h-12 rounded-xl text-white bg-green-600 hover:bg-green-700 flex items-center justify-center transition shadow-md flex-shrink-0 text-xs sm:text-sm font-semibold gap-1"
                >
                  <span className="sm:hidden"><i className="fas fa-plus mr-1"></i> Add Link</span>
                  <i className="hidden sm:inline fas fa-plus"></i>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 max-w-full">
                {dependencies.map((dep, i) => (
                  <span
                    key={i}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold break-all"
                  >
                    {dep.lhs} &rarr; {dep.rhs}
                    <button
                      type="button"
                      onClick={() => handleRemoveDependency(i)}
                      className="ml-1 text-green-500 hover:text-green-900 font-bold focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Target Normal Form */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Target Normal Form
              </label>
              <select
                value={targetForm}
                onChange={(e) => setTargetForm(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-sm sm:text-base outline-none cursor-pointer"
              >
                <option value="1NF">1NF</option>
                <option value="2NF">2NF</option>
                <option value="3NF">3NF</option>
                <option value="BCNF">BCNF</option>
              </select>
            </div>

            {/* Analyze Button */}
            <button
              type="button"
              onClick={handleAnalyze}
              className="w-full py-3.5 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-base flex items-center justify-center bg-purple-600 hover:bg-purple-700 transition shadow-md outline-none"
            >
              <i className="fas fa-search mr-2 text-xs sm:text-sm"></i> Analyze Normalization
            </button>
          </div>

          {/* Right: Live Preview Panel (Updated inner data modules to adapt responsively) */}
          <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg border border-gray-100 w-full overflow-hidden">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">Live Preview</h3>
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                  <i className="fas fa-table text-blue-600 text-xl"></i>
                </div>
                <h4 className="font-extrabold text-gray-800 text-base sm:text-lg truncate px-1">{tableName || "Table Name"}</h4>
                <p className="text-xs text-gray-500 font-semibold mt-0.5 break-all px-2">Primary Key: <span className="text-gray-700 font-mono">{primaryKey || "None"}</span></p>
              </div>

              {/* Dynamic Grid Layout: Stacks perfectly on tiny viewports (grid-cols-1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                
                {/* Columns Monitor Segment */}
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200/50 w-full">
                  <div className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-2 border-b border-gray-50 pb-1">Columns</div>
                  <div className="space-y-2 text-xs sm:text-sm font-medium text-gray-700 max-w-full">
                    {columns.map((col, i) => (
                      <div key={i} className="flex items-center gap-2 max-w-full overflow-hidden">
                        <div className={`w-2 h-2 ${getColumnColor(col)} rounded-full flex-shrink-0`}></div>
                        <span className="truncate break-all">{col}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dependencies Monitor Segment */}
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200/50 w-full">
                  <div className="text-purple-600 font-bold text-xs uppercase tracking-wider mb-2 border-b border-gray-50 pb-1">Dependencies</div>
                  <div className="space-y-1.5 text-xs sm:text-sm font-mono text-gray-600 max-w-full">
                    {dependencies.map((dep, i) => (
                      <div key={i} className="bg-blue-50/60 px-2 py-1 rounded-lg border border-blue-100/40 break-all leading-relaxed">
                        <span className="font-bold text-gray-800">{dep.lhs}</span> &rarr; <span>{dep.rhs}</span>
                      </div>
                    ))}
                    {dependencies.length === 0 && (
                      <div className="text-gray-400 text-center py-2 font-sans font-normal text-xs">None defined.</div>
                    )}
                  </div>
                </div>
                
              </div>

              {/* Target Form Status Panel */}
              <div className="mt-6 text-center border-t border-gray-200/60 pt-4">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Target Normal Form Status: <span className="font-bold text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full text-xs ml-1 font-mono">{targetForm}</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}