import React from "react";
import { motion as Motion } from "framer-motion";

// Single Export Card Component
function ExportCard({
  icon,
  bgColor,
  textColor,
  title,
  description,
  buttonText,
  onClick,
  index,
}) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      // Scaled down mobile hover to prevent accidental touch page overflows
      whileHover={{ scale: 1.03, boxShadow: "0px 12px 24px rgba(0,0,0,0.15)" }}
      className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm flex flex-col justify-between h-full w-full"
    >
      <div>
        <div className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0`}>
          <i className={`${icon} ${textColor} text-xl`} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={onClick}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 outline-none"
      >
        <i className="fas fa-download text-xs" /> {buttonText}
      </button>
    </Motion.div>
  );
}

// Combined Results/Export Section
export default function ResultSection({ onDownload }) {
  const originalData = [
    {
      id: "101",
      first: "John",
      last: "Doe",
      email: "john@email.com",
      depId: "D001",
      depName: "Engineering",
      mgrId: "M201",
      mgrName: "Sarah Wilson",
      salary: 75000,
    },
    {
      id: "102",
      first: "Jane",
      last: "Smith",
      email: "jane@email.com",
      depId: "D001",
      depName: "Engineering",
      mgrId: "M201",
      mgrName: "Sarah Wilson",
      salary: 82000,
    },
    {
      id: "103",
      first: "Mike",
      last: "Johnson",
      email: "mike@email.com",
      depId: "D002",
      depName: "Marketing",
      mgrId: "M202",
      mgrName: "David Brown",
      salary: 68000,
    },
  ];

  const exportOptions = [
    {
      icon: "fas fa-code",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      title: "SQL Export",
      description: "Complete SQL schema with CREATE TABLE statements and constraints",
      buttonText: "Download SQL",
      key: "sql",
    },
    {
      icon: "fas fa-file-code",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      title: "JSON Schema",
      description: "Structured JSON format for API documentation and code generation",
      buttonText: "Download JSON",
      key: "json",
    },
    {
      icon: "fas fa-project-diagram",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      title: "ER Diagram",
      description: "Visual entity-relationship diagram for documentation and presentations",
      buttonText: "Download Diagram",
      key: "diagram",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen w-full overflow-hidden">
      {/* Header (Updated to align elements neatly on touch screens) */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="bg-white p-2 rounded-xl flex-shrink-0">
              <i className="fas fa-database text-blue-600 text-xl"></i>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Database Normalizer Results</h1>
          </div>
          <span className="text-xs sm:text-sm text-blue-100 font-semibold tracking-wide bg-white/10 px-3 py-1 rounded-full">
            Converted Tables Output
          </span>
        </div>
      </header>

      {/* Main Section */}
      <main className="container mx-auto px-4 py-6 sm:py-8 w-full">
        
        {/* Results Metadata Summary Cards */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 text-center sm:text-left">Normalization Complete</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-xl border border-green-100">
              <i className="fas fa-check-circle text-green-500 text-xl sm:text-2xl mb-1.5 sm:mb-2 block"></i>
              <div className="text-xs sm:text-sm font-bold text-green-700">BCNF Achieved</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100">
              <i className="fas fa-table text-blue-500 text-xl sm:text-2xl mb-1.5 sm:mb-2 block"></i>
              <div className="text-xs sm:text-sm font-bold text-blue-700">3 Tables Created</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-xl border border-purple-100">
              <i className="fas fa-link text-purple-500 text-xl sm:text-2xl mb-1.5 sm:mb-2 block"></i>
              <div className="text-xs sm:text-sm font-bold text-purple-700">2 Relationships</div>
            </div>
          </div>
        </div>

        {/* Original Data Redundancy Evaluation Table Area */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
          
          {/* Header Container (Updated from row to adaptive stack layout) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 border-b border-gray-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-1.5">
              <i className="fas fa-exclamation-triangle text-yellow-500 text-sm"></i>
              Original Source Matrix
            </h3>
            <span className="px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 text-[11px] font-bold rounded-full w-fit">
              1NF - High Structural Redundancy
            </span>
          </div>

          {/* Matrix Loader Window Wrapper */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-inner">
            <table className="w-full border-collapse text-left text-xs sm:text-sm min-w-[800px] sm:min-w-0">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-[10px] sm:text-xs font-bold tracking-wider">
                  <th className="border-b border-gray-200 px-3 sm:px-4 py-2.5 text-blue-700">EmployeeID</th>
                  <th className="border-b border-gray-200 px-3 sm:px-4 py-2.5">FirstName</th>
                  <th className="border-b border-gray-200 px-3 sm:px-4 py-2.5">LastName</th>
                  <th className="border-b border-gray-200 px-3 sm:px-4 py-2.5">Email</th>
                  <th className="border-b border-gray-200 px-3 sm:px-4 py-2.5">DepartmentID</th>
                  <th className="border-b border-gray-200 px-3 sm:px-4 py-2.5">DepartmentName</th>
                  <th className="border-b border-gray-200 px-3 sm:px-4 py-2.5">ManagerID</th>
                  <th className="border-b border-gray-200 px-3 sm:px-4 py-2.5">ManagerName</th>
                  <th className="border-b border-gray-200 px-3 sm:px-4 py-2.5">Salary</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 font-normal">
                {originalData.map((row, i) => (
                  <tr key={row.id} className={`hover:bg-gray-50/80 transition-colors ${i % 2 === 1 ? "bg-gray-50/40" : "bg-white"}`}>
                    <td className="border-b border-gray-100 px-3 sm:px-4 py-2.5 font-mono font-bold text-blue-600">{row.id}</td>
                    <td className="border-b border-gray-100 px-3 sm:px-4 py-2.5">{row.first}</td>
                    <td className="border-b border-gray-100 px-3 sm:px-4 py-2.5">{row.last}</td>
                    <td className="border-b border-gray-100 px-3 sm:px-4 py-2.5 font-mono">{row.email}</td>
                    <td className="border-b border-gray-100 px-3 sm:px-4 py-2.5 font-mono">{row.depId}</td>
                    <td className="border-b border-gray-100 px-3 sm:px-4 py-2.5">{row.depName}</td>
                    <td className="border-b border-gray-100 px-3 sm:px-4 py-2.5 font-mono">{row.mgrId}</td>
                    <td className="border-b border-gray-100 px-3 sm:px-4 py-2.5">{row.mgrName}</td>
                    <td className="border-b border-gray-100 px-3 sm:px-4 py-2.5 font-mono">{row.salary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Anomaly Reports Panel */}
          <div className="mt-4 bg-red-50/60 p-4 rounded-xl border border-red-100">
            <h4 className="font-bold text-red-800 text-xs sm:text-sm mb-1.5 uppercase tracking-wide">Anomaly Profile Detected:</h4>
            <ul className="text-xs sm:text-sm text-red-700 space-y-1.5 pl-0.5">
              <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">&bull;</span> <span>DepartmentName repeated redundant data fields for each record.</span></li>
              <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">&bull;</span> <span>ManagerName duplication triggers update/deletion data vulnerability.</span></li>
            </ul>
          </div>
        </div>

        {/* Export Integration Layout Section */}
        <section className="py-8 sm:py-12 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl border border-gray-200/40 w-full px-2 sm:px-4">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-2">Export Your Schema</h2>
            <p className="text-xs sm:text-sm text-gray-600 px-2">Multiple production schema formats optimized for developer workflows</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {exportOptions.map((opt, index) => (
              <ExportCard
                key={opt.key}
                icon={opt.icon}
                bgColor={opt.bgColor}
                textColor={opt.textColor}
                title={opt.title}
                description={opt.description}
                buttonText={opt.buttonText}
                onClick={() => onDownload(opt.key)}
                index={index}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-slate-300 py-6 mt-12 text-center text-xs px-4">
        <p className="font-medium">&copy; {new Date().getFullYear()} Database Normalizer - Result Tables Output</p>
        <p className="text-gray-400 mt-1 font-normal">Showing converted normalized database tables with relationships</p>
      </footer>
    </div>
  );
}