import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import Herosection from './components/Herosection.jsx';
import Feature from './components/Feature.jsx';
import InputSection from './components/Inputsection.jsx';
import FileUploadSection from './components/FileUploadSection.jsx';
import AnalysisSection from './components/AnalysisSection.jsx';
import ResultSection from './components/ResultSection.jsx';
import Footer from './components/Footer.jsx';
import LearnSection from './components/LearnSection.jsx';
import { detectNormalForm, normalizeTo, normalizeWithData } from './api/normService';
import './App.css';

function App() {
  // --- STATE 1: Navigation ('home', 'tool', 'learn') ---
  const [currentView, setCurrentView] = useState('home');

  // --- STATE 2: Tool Logic (Schema & Data) ---
  const [schema, setSchema] = useState({
    tableName: "",
    attributes: [],
    primaryKey: [],
    functionalDependencies: [],
    multivaluedDependencies: [],
    joinDependencies: []
  });

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- HANDLERS ---
  const handleSchemaUpdate = useCallback((newSchema) => {
    setSchema(newSchema);
    setResult(null); 
  }, []);

  const handleFileSelect = (uploadedFile) => {
    setFile(uploadedFile);
    setResult(null);
  };

  const handleAnalyze = async (schemaToAnalyze) => {
    if (!schemaToAnalyze.attributes || schemaToAnalyze.attributes.length === 0) {
      setError("Please provide attributes to analyze.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await detectNormalForm(schemaToAnalyze);
      setResult(response);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to fetch analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleNormalize = async (schemaToNormalize, target) => {
    if (!schemaToNormalize.attributes || schemaToNormalize.attributes.length === 0) {
      setError("Please provide attributes to normalize.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let response;
      if (file) {
        response = await normalizeWithData(file, schemaToNormalize, target);
        setResult({ type: 'DATA', tables: response, target: target });
      } else {
        response = await normalizeTo(schemaToNormalize, target);
        setResult({ type: 'SCHEMA', ...response });
      }
    } catch (err) {
      console.error("Normalization failed:", err);
      setError("Failed to normalize.");
    } finally {
      setLoading(false);
    }
  };

  // --- VIEW RENDERING ENGINE ---
  const renderContent = () => {
    switch(currentView) {
      case 'home':
        return (
          <div className="animate-fade-in">
            <Herosection 
              onStart={() => setCurrentView('tool')} 
              onLearn={() => setCurrentView('learn')} 
            />
            <Feature />
            
            {/* FOOTER IS NOW ONLY HERE */}
            <Footer setCurrentView={setCurrentView} />
          </div>
        );
      
      case 'learn':
        return (
          <div className="animate-fade-in">
            <LearnSection />
          </div>
        );
      
      case 'tool':
  return (
    // Added w-full, max-w-7xl, mx-auto, and px-4 for adaptive edge spacing
    <div className="animate-fade-in space-y-6 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <InputSection onSchemaUpdate={handleSchemaUpdate} />
      <FileUploadSection onFileSelect={handleFileSelect} />
      <AnalysisSection
        onDetect={handleAnalyze}
        onNormalize={handleNormalize}
        loading={loading}
        schema={schema}
      />
      {error && (
        <div className="w-full mt-4">
          <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center border border-red-200 text-sm sm:text-base">
            {error}
          </div>
        </div>
      )}
      <ResultSection result={result} />
    </div>
  );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navigation Bar (Always Visible) */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* Main Content Area */}
      <main>
        {renderContent()}
      </main>
      
      {/* Global Footer REMOVED from here */}
    </div>
  );
}

export default App;