import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContextValue';
import {
  DollarSign, Briefcase, Clock, ChevronRight, ExternalLink,
  CheckCircle2, AlertCircle, CheckSquare, Brain, Sparkles,
  RotateCcw, Target, Award, TrendingUp, MapPin, Zap,
  RefreshCw, Info, Star, Loader2, Upload, Banknote
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import DashboardResumeAnalyzer from '../../components/DashboardResumeAnalyzer';
import AIRoadmap from '../../components/AIRoadmap';

// ─── Match Badge config ────────────────────────────────────────────────────────
const MATCH_BADGE = {
  'Best Match': {
    bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    text: 'text-white',
    icon: <Award size={10} />,
    ring: 'ring-2 ring-emerald-300',
    cardBorder: 'border-emerald-200 shadow-emerald-500/10',
    cardGlow: 'shadow-lg',
  },
  'Good Match': {
    bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    text: 'text-white',
    icon: <Star size={10} />,
    ring: '',
    cardBorder: 'border-blue-200 shadow-blue-500/10',
    cardGlow: 'shadow-md',
  },
  'Fair Match': {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    icon: <TrendingUp size={10} />,
    ring: '',
    cardBorder: 'border-slate-100',
    cardGlow: 'shadow-sm',
  },
  'Explore': {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    icon: <Target size={10} />,
    ring: '',
    cardBorder: 'border-slate-100',
    cardGlow: 'shadow-sm',
  },
};

// ─── Animated Score Bar ────────────────────────────────────────────────────────
const ScoreBar = ({ score }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(score), 120); return () => clearTimeout(t); }, [score]);

  const barColor =
    score >= 75 ? 'from-emerald-400 to-teal-500' :
      score >= 50 ? 'from-blue-400 to-indigo-500' :
        score >= 25 ? 'from-amber-400 to-orange-400' :
          'from-slate-300 to-slate-400';

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
        <span>Relevance</span>
        <span className={score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-blue-600' : 'text-slate-500'}>
          {score}%
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

// ─── Recommendation Card ───────────────────────────────────────────────────────
const RecommendCard = ({ rec, index, onApply }) => {
  const navigate = useNavigate();
  const meta = MATCH_BADGE[rec.matchLabel] || MATCH_BADGE['Explore'];
  const isBest = rec.matchLabel === 'Best Match';

  return (
    <div
      className={`relative group bg-white rounded-2xl p-5 border transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-xl cursor-pointer animate-fade-in
        ${meta.cardBorder} ${meta.cardGlow}`}
      style={{ animationDelay: `${index * 70}ms` }}
      onClick={() => navigate(`/internships/${rec._id}`)}
    >
      {/* "Best Match" accent line */}
      {isBest && (
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-emerald-400 to-teal-500" />
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Company logo placeholder */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
          ${isBest ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'
            : 'bg-slate-100 text-slate-400 group-hover:bg-blue-500 group-hover:text-white'}`}>
          <Briefcase size={18} />
        </div>

        {/* Match badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black
          ${meta.bg} ${meta.text} ${meta.ring} shrink-0`}>
          {meta.icon}
          {rec.matchLabel}
        </span>
      </div>

      <div className="mb-3">
        <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
          {rec.title}
        </h3>
        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
          <Building2 size={11} className="shrink-0" />
          <span className="truncate">{rec.company}</span>
          <span className="text-slate-300">·</span>
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">{rec.location}</span>
        </div>
      </div>

      <ScoreBar score={rec.relevanceScore} label={rec.matchLabel} />

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
          <Banknote size={12} />
          <span>₹{rec.stipend?.toLocaleString()}/mo</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onApply(rec._id); }}
          className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all
            ${isBest
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/25'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

// ─── Profile Strength Meter ────────────────────────────────────────────────────
const ProfileStrengthMeter = ({ strength }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(strength), 200); return () => clearTimeout(t); }, [strength]);

  return (
    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl px-4 py-2 hover:shadow-md transition-all cursor-default group">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap group-hover:text-blue-600 transition-colors">Profile Readiness</div>
      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-xs font-black text-blue-600 whitespace-nowrap">{strength}%</span>
    </div>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recMeta, setRecMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(true);
  const [resumeProfile, setResumeProfile] = useState(null);

  // AI Roadmap State
  const [dashboardRoadmap, setDashboardRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const { user } = useContext(AuthContext);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchRecommendations = useCallback(async (silent = false) => {
    if (!silent) setRecLoading(true);
    try {
      const { data } = await api.get('/internships/recommend?limit=6');
      setRecommendations(data.recommendations || []);
      setRecMeta(data.meta || null);
    } catch {
      // Silently fail — recommendations are non-critical
    } finally {
      setRecLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [internRes, appRes, taskRes] = await Promise.all([
          api.get('/internships'),
          api.get('/applications/my-applications'),
          api.get('/tasks'),
        ]);
        setInternships(internRes.data.slice(0, 3));
        setApplications(appRes.data);
        setTasks(taskRes.data.filter((t) => t.assignedTo?._id === user._id && t.status !== 'Completed'));

        // Load resume profile silently
        try {
          const resumeRes = await api.get('/resume/profile');
          if (resumeRes.data.analyzed) {
            // In the new unified response, profile data might be directly on the object
            setResumeProfile(resumeRes.data.profile || resumeRes.data);
          }
        } catch { /* not analyzed yet */ }
      } catch (err) {
        console.error('Dashboard fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchRecommendations();

    // Mock chart data for "Pro" appearance
    setChartData([
      { name: 'Mon', apps: 4 },
      { name: 'Tue', apps: 7 },
      { name: 'Wed', apps: 5 },
      { name: 'Thu', apps: 12 },
      { name: 'Fri', apps: 9 },
      { name: 'Sat', apps: 11 },
      { name: 'Sun', apps: 15 },
    ]);
  }, [fetchRecommendations]);

  useEffect(() => {
    if (resumeProfile?.skillsByCategory) {
      const formattedSkills = Object.entries(resumeProfile.skillsByCategory).map(([category, skills]) => ({
        subject: category,
        A: Math.min(skills.length * 20 + 40, 100), // Scale based on matches
        fullMark: 100,
      }));
      setSkillData(formattedSkills);
    } else if (resumeProfile?.skills) {
      setSkillData(resumeProfile.skills.slice(0, 6).map(s => ({
        subject: s,
        A: 85,
        fullMark: 100,
      })));
    }
  }, [resumeProfile]);

  // Fetch roadmap if student has an accepted or premium application
  useEffect(() => {
    if (applications.length > 0) {
      const fetchDashboardRoadmap = async () => {
        setRoadmapLoading(true);
        try {
          // Show roadmap for the most recent applied internship
          const latestApp = applications[0];
          const { data } = await api.get(`/ai/roadmap/${latestApp.internship._id}`);
          setDashboardRoadmap(data);
        } catch {
          // Silent fail for dashboard
        } finally {
          setRoadmapLoading(false);
        }
      };
      fetchDashboardRoadmap();
    }
  }, [applications]);

  const handleAnalysisComplete = (data) => {
    setResumeProfile({
      skills: data.analysis.allSkills,
      keywords: data.analysis.keywords,
      education: data.analysis.education,
      analyzed: true
    });
    fetchRecommendations(true);
  };

  const handleApply = async (internshipId) => {
    try {
      await api.post('/applications', { internshipId });
      toast.success('Applied successfully!');
      // Refresh recommendations (this internship will now be excluded)
      fetchRecommendations(true);
      const appRes = await api.get('/applications/my-applications');
      setApplications(appRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted': return <span className="badge badge-accepted">Accepted</span>;
      case 'Rejected': return <span className="badge badge-rejected">Rejected</span>;
      default: return <span className="badge badge-pending">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-500" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* ── Dashboard Hero ── */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Student Portal</span>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">SmartED Innovations</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            {getGreeting()}, <span className="text-blue-600">{user.name.split(' ')[0]}!</span>
          </h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-3 max-w-lg leading-relaxed">
            Welcome to your career dashboard. Track your applications and discover new opportunities.
          </p>
        </div>
      </section>

      {/* ── Dashboard Stats ────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 flex items-center gap-6 shadow-sm group">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Applications</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{applications.length}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 flex items-center gap-6 shadow-sm group">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Accepted</p>
              <p className="text-3xl font-black text-slate-900 leading-none">
                {applications.filter((a) => a.status === 'Accepted').length}
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 flex items-center gap-6 shadow-sm group">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <CheckSquare size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Assigned Tasks</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{tasks.length}</p>
            </div>
          </div>
      </section>

      {/* ── Recommendations ──────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Recommended Internships</h2>
          </div>
        </div>

        {recLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-48 animate-pulse border border-slate-100"></div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, i) => (
              <RecommendCard key={rec._id} rec={rec} index={i} onApply={handleApply} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-12 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase">No recommendations available</p>
          </div>
        )}
      </section>

      {/* ── Main 2-col grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* All Internships */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Latest Opportunities</h2>
            <Link to="/internships" className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {internships.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{job.title}</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase">{job.company}</p>
                    </div>
                  </div>
                  <Link to={`/internships/${job._id}`} className="p-2 bg-blue-50 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Application Status</h3>
             <div className="space-y-4">
               {applications.slice(0, 4).map((app) => (
                 <div key={app._id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-none">
                    <div className="overflow-hidden mr-2">
                      <p className="font-bold text-slate-800 text-xs truncate uppercase">{app.internship?.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{app.internship?.company}</p>
                    </div>
                    {getStatusBadge(app.status)}
                 </div>
               ))}
             </div>
          </div>

          <Link to="/resume-analyzer" className="block bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white group relative overflow-hidden shadow-xl shadow-blue-600/20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50" />
            <div className="relative z-10">
              <Brain size={32} className="text-white mb-4" />
              <h3 className="text-lg font-black uppercase tracking-tighter">AI Resume Insights</h3>
              <p className="text-xs text-blue-100 mt-2 mb-6">Analyze your resume to get better matches.</p>
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-full border border-white/30 group-hover:bg-white group-hover:text-blue-600 transition-all">
                Analyze Now <ChevronRight size={14} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Internal local SVG utility
const Building2 = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" />
    <path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" />
  </svg>
);

export default StudentDashboard;
