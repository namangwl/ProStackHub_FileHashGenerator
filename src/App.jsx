// src/App.jsx
import React, { useState, useRef } from 'react';
import { analyzeFile } from './utils/hashEngine';
import { UploadCloud, FileText, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import './App.css';

const App = () => {
  // Grouping related UI states to avoid clutter
  const [dragActive, setDragActive] = useState(false);
  const [uiState, setUiState] = useState({ isLoading: false, errorStr: '' });
  const [fileDetails, setFileDetails] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null); // Tracks which hash was copied

  // Hidden file input reference for the manual click upload fallback
  const inputRef = useRef(null);

  // Core processing trigger
  const runFileAnalysis = async (targetFile) => {
    if (!targetFile) return;
    
    setUiState({ isLoading: true, errorStr: '' });
    setFileDetails(null);

    try {
      const results = await analyzeFile(targetFile);
      setFileDetails(results);
    } catch (err) {
      setUiState({ isLoading: false, errorStr: err });
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Drag and Drop native handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    // Grab the first file dropped
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      runFileAnalysis(e.dataTransfer.files[0]);
    }
  };

  const handleManualSelect = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      runFileAnalysis(e.target.files[0]);
    }
  };

  // Utility to copy hash to clipboard and show brief visual feedback
  const copyToClipboard = (hashType, hashValue) => {
    navigator.clipboard.writeText(hashValue);
    setCopiedHash(hashType);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="layout-container">
      <div className="tool-card">
        
        <div className="branding-header">
          <h2>Cryptographic File Hasher</h2>
          <p>Generate MD5, SHA-1, and SHA-256 digests locally.</p>
        </div>

        {/* Custom Drag & Drop Zone */}
        <div 
          className={`dnd-zone ${dragActive ? 'active-drag' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden-input"
            onChange={handleManualSelect}
          />
          <UploadCloud size={42} className="upload-icon" />
          <p className="upload-text">
            <strong>Click to upload</strong> or drag and drop a file here
          </p>
          <span className="upload-subtext">Maximum client-side stability up to 100MB</span>
        </div>

        {/* State rendering: Loading or Errors */}
        {uiState.isLoading && <div className="spinner">Analyzing binary stream...</div>}
        
        {uiState.errorStr && (
          <div className="error-banner">
            <AlertTriangle size={18} />
            <span>{uiState.errorStr}</span>
          </div>
        )}

        {/* Results Panel */}
        {fileDetails && !uiState.isLoading && (
          <div className="results-wrapper">
            <div className="file-meta">
              <FileText size={20} />
              <div className="meta-text">
                <span className="fname">{fileDetails.fileName}</span>
                <span className="fsize">{fileDetails.fileSize}</span>
              </div>
            </div>

            <div className="hash-outputs">
              {Object.entries(fileDetails.hashes).map(([algo, hashStr]) => (
                <div className="hash-block" key={algo}>
                  <div className="hash-header">
                    <span className="algo-label">{algo.toUpperCase()}</span>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(algo, hashStr)}
                      title={`Copy ${algo} hash`}
                    >
                      {copiedHash === algo ? <CheckCircle2 size={16} className="success-icon" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="hash-string">{hashStr}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;