import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import {
  Upload, FileText, Brain, Target, BookOpen, Layers,
  ChevronRight, RotateCcw, CheckCircle2, AlertCircle,
  Sparkles, TrendingUp, Award, Search, Loader2, Zap
} from 'lucide-react';

// ─── Colour palette for categories ───────────────────────────────────────────
const CATEGORY_COLORS = {
  Languages: { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
  Frontend: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  Backend: { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  Databases: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Cloud: { bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500' },
  'Data & AI': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Tools & Practices': { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
  'UI/UX & Design': { bg: 'bg-pink-100', text: 'text-pink-700', dot: 'bg-pink-500' },
  'Soft Skills & Business': { bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-500' },
};

const DEFAULT_COLOR = { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' };

// ─── Match Score Bar Component ─────────────────────────────────────────────────
const MatchScoreBar = ({ score }) => {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (s) => {
    if (s >= 70) return { bar: 'from-emerald-400 to-emerald-600', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', label: 'Strong Match' };
    if (s >= 40) return { bar: 'from-amber-400 to-amber-600', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', label: 'Moderate Match' };
    return { bar: 'from-rose-400 to-rose-600', text: 'text-rose-600', badge: 'bg-rose-100 text-rose-700', label: 'Low Match' };
  };

  const colors = getColor(score);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2 bg-blue-100/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-1000 ease-out`}
          style={{ width: `${animated}%` }}
        />
      </div>
      <span className={`text-sm font-black tabular-nums ${colors.text} min-w-[2.5rem] text-right`}>
        {score}%
      </span>
    </div>
  );
};

// ─── Internship Match Card ─────────────────────────────────────────────────────
const InternshipCard = ({ match, index }) => {
  const navigate = useNavigate();
  const getScoreMeta = (s) => {
    if (s >= 70) return { badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200', icon: <Award size={12} />, label: 'Strong Match' };
    if (s >= 40) return { badge: 'bg-amber-100 text-amber-700 border border-amber-200', icon: <TrendingUp size={12} />, label: 'Moderate' };
    return { badge: 'bg-slate-100 text-slate-600 border border-slate-200', icon: <Target size={12} />, label: 'Low Match' };
  };

  const meta = getScoreMeta(match.matchScore);

  return (
    <div
      className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 text-sm leading-snug truncate group-hover:text-blue-600 transition-colors">
            {match.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{match.company} · {match.location}</p>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${meta.badge}`}>
          {meta.icon} {meta.label}
        </span>
      </div>

      <MatchScoreBar score={match.matchScore} />

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          ₹{match.stipend?.toLocaleString()}/mo
        </span>
        <button
          onClick={() => navigate(`/internships/${match._id}`)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group/btn"
        >
          View Details
          <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// ─── Skill Badge ──────────────────────────────────────────────────────────────
const SkillBadge = ({ skill, category, delay = 0 }) => {
  const colors = CATEGORY_COLORS[category] || DEFAULT_COLOR;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {skill}
    </span>
  );
};

// ─── Upload Drop Zone ──────────────────────────────────────────────────────────
const UploadZone = ({ onFileSelect, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileValidation = useCallback((file) => {
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted. Please re-upload.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5MB.');
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileValidation(file);
  }, [handleFileValidation]);

  return (
    <div
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => !isAnalyzing && fileInputRef.current?.click()}
      className={`relative w-full rounded-3xl border-2 border-dashed p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300
        ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}
        ${isAnalyzing ? 'pointer-events-none opacity-75' : ''}`}
    >
      {/* Animated background glow on drag */}
      {isDragging && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 pointer-events-none" />
      )}

      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg
        ${isDragging ? 'bg-blue-600 scale-110' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
        {isAnalyzing ? (
          <Loader2 size={36} className="text-white animate-spin" />
        ) : selectedFile ? (
          <FileText size={36} className="text-white" />
        ) : (
          <Upload size={36} className="text-white" />
        )}
      </div>

      {isAnalyzing ? (
        <>
          <div>
            <p className="text-lg font-bold text-slate-800 text-center">Analyzing Resume...</p>
            <p className="text-sm text-slate-500 text-center mt-1">Extracting skills, education & matching internships</p>
          </div>
          {/* Progress dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </>
      ) : selectedFile ? (
        <>
          <div>
            <p className="text-lg font-bold text-slate-800 text-center">{selectedFile.name}</p>
            <p className="text-sm text-emerald-600 font-medium text-center mt-1">
              <CheckCircle2 size={14} className="inline mr-1" />
              Ready to analyze · {(selectedFile.size / 1024).toFixed(0)} KB
            </p>
          </div>
          <p className="text-xs text-slate-400">Click to change file</p>
        </>
      ) : (
        <>
          <div>
            <p className="text-lg font-bold text-slate-800 text-center">Drop your resume here</p>
            <p className="text-sm text-slate-500 text-center mt-1">or click to browse · PDF only · Max 5MB</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {['Skills Extraction', 'Internship Matching', 'Match Score'].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">{tag}</span>
            ))}
          </div>
        </>
      )}

      <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFileValidation(e.target.files[0]); }} />
    </div>
  );
};

// ─── Main Resume Analyzer Page ─────────────────────────────────────────────────
const ResumeAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('skills');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load previously analyzed profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/resume/profile');
        if (data.analyzed) {
          setResults({
            analysis: {
              allSkills: data.skills,
              education: data.education,
              keywords: data.keywords,
              skillsByCategory: data.skills.reduce((acc, skill) => {
                acc['Saved Skills'] = acc['Saved Skills'] || [];
                acc['Saved Skills'].push(skill);
                return acc;
              }, {}),
              totalSkillsFound: data.skills.length,
            },
            matches: data.matches,
            summary: {
              totalInternships: data.matches.length,
              strongMatches: data.matches.filter((m) => m.matchScore >= 70).length,
              moderateMatches: data.matches.filter((m) => m.matchScore >= 40 && m.matchScore < 70).length,
            },
            fromCache: true,
          });
        }
      } catch {
        // Silently fails — user might not have analyzed yet
      } finally {
        setIsLoadingProfile(false);
      }
    };
    loadProfile();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.warn('Please select a PDF resume first.');
      return;
    }
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const { data } = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults({ ...data, fromCache: false });
      setActiveTab('skills');
      toast.success(`Analysis complete! Found ${data.analysis.totalSkillsFound} skills.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setSelectedFile(null);
  };

  const TABS = [
    { id: 'skills', label: 'Skills', icon: <Brain size={15} /> },
    { id: 'matches', label: 'Matches', icon: <Target size={15} /> },
    { id: 'keywords', label: 'Keywords', icon: <Search size={15} /> },
    { id: 'ai-tips', label: 'AI Tips', icon: <Sparkles size={15} /> },
  ];

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Resume Analyzer</h1>
              <p className="text-sm text-slate-500">AI-powered skill extraction & internship matching</p>
            </div>
          </div>
        </div>

        {/* ── Upload Section (always visible) ────────────────── */}
        {!results && (
          <div className="glass-card mb-6 animate-fade-in">
            <UploadZone onFileSelect={setSelectedFile} isAnalyzing={isAnalyzing} />
            {selectedFile && !isAnalyzing && (
              <button
                onClick={handleAnalyze}
                className="btn btn-primary w-full mt-5 py-4 text-base rounded-2xl group shadow-blue-500/20"
              >
                <Sparkles size={18} />
                Analyze My Resume
                <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        )}

        {/* ── Results ────────────────────────────────────────── */}
        {results && (
          <div className="animate-fade-in space-y-5">

            {/* Re-analyze banner */}
            {results.fromCache && (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3">
                <AlertCircle size={16} className="text-blue-600 shrink-0" />
                <p className="text-sm text-blue-700 font-medium flex-1">
                  Showing your previously analyzed resume. Upload a new resume to refresh.
                </p>
                <button onClick={handleReset} className="btn btn-outline text-sm py-1.5 px-3 rounded-xl">
                  <Upload size={14} /> Upload New
                </button>
              </div>
            )}

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Skills Found', value: results.analysis.totalSkillsFound, icon: <Brain size={18} />, color: 'bg-blue-600' },
                { label: 'Open Positions', value: results.summary.totalInternships, icon: <Layers size={18} />, color: 'bg-indigo-600' },
                { label: 'Strong Matches', value: results.summary.strongMatches, icon: <Award size={18} />, color: 'bg-emerald-600' },
                { label: 'Education', value: results.analysis.education, icon: <BookOpen size={18} />, color: 'bg-violet-600', small: true },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-600/10`}>
                    {card.icon}
                  </div>
                  <p className={`font-black text-slate-800 ${card.small ? 'text-sm leading-tight' : 'text-2xl'}`}>{card.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl p-1.5 flex gap-1 border border-slate-100 shadow-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Skills by Category */}
            {activeTab === 'skills' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
                <h2 className="font-black text-slate-900 flex items-center gap-2">
                  <Brain size={18} className="text-blue-500" /> Extracted Skills
                </h2>
                {Object.entries(results.analysis.skillsByCategory).length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <AlertCircle size={32} className="mx-auto mb-2" />
                    <p className="text-sm">No skills detected. Try uploading a different resume.</p>
                  </div>
                ) : (
                  Object.entries(results.analysis.skillsByCategory).map(([category, skills], catIdx) => {
                    const colors = CATEGORY_COLORS[category] || DEFAULT_COLOR;
                    return (
                      <div key={category} className="animate-fade-in" style={{ animationDelay: `${catIdx * 50}ms` }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                          <p className={`text-xs font-black uppercase tracking-widest ${colors.text}`}>{category}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors.bg} ${colors.text}`}>{skills.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-4">
                          {skills.map((skill, i) => (
                            <SkillBadge key={skill} skill={skill} category={category} delay={catIdx * 50 + i * 30} />
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab: Internship Matches */}
            {activeTab === 'matches' && (
              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 text-sm text-slate-600">
                  <TrendingUp size={16} className="text-blue-500" />
                  <span>Internships sorted by match score. Higher means better alignment with your skills.</span>
                </div>
                {results.matches.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 border border-slate-100 text-center text-slate-400">
                    <Target size={36} className="mx-auto mb-3" />
                    <p className="font-semibold text-slate-600">No open internships found</p>
                    <p className="text-sm mt-1">Check back after recruiters post new openings.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.matches.map((match, i) => (
                      <InternshipCard key={match._id} match={match} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Keywords */}
            {activeTab === 'keywords' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="font-black text-slate-900 flex items-center gap-2 mb-4">
                  <Search size={18} className="text-blue-500" /> Top Keywords from Your Resume
                </h2>
                <p className="text-xs text-slate-500 mb-4">These are the most frequently used meaningful terms in your document. Strong keywords improve your ATS visibility.</p>
                <div className="flex flex-wrap gap-2">
                  {(results.analysis.keywords || []).map((kw, i) => (
                    <span
                      key={kw}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 text-blue-600 text-xs rounded-full font-bold transition-colors cursor-default animate-fade-in"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: AI Tips */}
            {activeTab === 'ai-tips' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-900 leading-tight">AI Success Insights</h2>
                    <p className="text-xs text-slate-500">Intelligent suggestions to boost your candidate ranking</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={16} className="text-blue-600" />
                      <h3 className="text-sm font-black text-blue-900 uppercase">Impact Score</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Your resume shows strong technical depth, but could benefit from more quantitative results. Try adding metrics (e.g., "Increased performance by 20%").
                    </p>
                  </div>
                  <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={16} className="text-emerald-600" />
                      <h3 className="text-sm font-black text-emerald-900 uppercase">Market Alignment</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {results.analysis?.allSkills?.length > 0
                        ? `You have great alignment with ${results.analysis.allSkills.slice(0, 2).join(' & ')}. Focus on these in your next set of applications.`
                        : "Focus on highlighting your core technical competencies (e.g., Backend, Databases) to align better with open roles."}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100 italic">
                  <p className="text-xs text-slate-500 font-medium">
                    "The system has identified {results.summary?.strongMatches || 0} strong internship matches for your profile. To reach 100% suitability, consider exploring more in-depth projects in the 'Cloud & Databases' domain."
                  </p>
                </div>
              </div>
            )}

            {/* Re-analyze CTA */}
            {!results.fromCache && (
              <button
                onClick={handleReset}
                className="btn btn-outline w-full py-3 rounded-2xl text-sm"
              >
                <RotateCcw size={15} /> Analyze a Different Resume
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ResumeAnalyzer;
