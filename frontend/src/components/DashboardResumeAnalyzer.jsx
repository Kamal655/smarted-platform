import React, { useState, useCallback, useRef } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { 
  Upload, FileText, Brain, Sparkles, ChevronRight, Loader2, CheckCircle2 
} from 'lucide-react';

/**
 * DashboardResumeAnalyzer Component
 * ─────────────────────────────────────────────
 * A condensed, high-impact version of the Resume Analyzer
 * designed specifically for dashboard integration.
 */
const DashboardResumeAnalyzer = ({ onAnalysisComplete }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (file && file.type === 'application/pdf') {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Max 5MB allowed.');
        return;
      }
      setSelectedFile(file);
    } else {
      toast.error('Please upload a valid PDF resume.');
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const { data } = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resume analyzed successfully!');
      if (onAnalysisComplete) onAnalysisComplete(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
        className={`relative group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer
          ${isDragOver ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}
          ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="application/pdf"
          onChange={(e) => handleFileChange(e.target.files[0])}
        />

        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all
          ${isAnalyzing ? 'bg-blue-600 animate-pulse' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
          {isAnalyzing ? (
            <Loader2 size={24} className="animate-spin text-white" />
          ) : selectedFile ? (
            <FileText size={24} />
          ) : (
            <Upload size={24} />
          )}
        </div>

        {isAnalyzing ? (
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">Processing Your Profile...</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">AI Extraction in progress</p>
          </div>
        ) : selectedFile ? (
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{selectedFile.name}</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center justify-center gap-1">
              <CheckCircle2 size={10} /> Ready for analysis
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-bold text-slate-700">Drop your resume here</p>
            <p className="text-xs text-slate-400 mt-1">PDF format · Max 5MB</p>
          </div>
        )}
      </div>

      {selectedFile && !isAnalyzing && (
        <button 
          onClick={handleUpload}
          className="btn btn-primary w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Sparkles size={16} />
          Start AI Analysis
          <ChevronRight size={16} />
        </button>
      )}

      <div className="mt-6 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
           <Brain size={12} className="text-blue-500" /> Features
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {['Skill Extraction', 'Match Scoring', 'Keyword DNA', 'Smart Rank'].map(tag => (
            <div key={tag} className="flex items-center gap-2 py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-1 h-1 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-slate-600">{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardResumeAnalyzer;
