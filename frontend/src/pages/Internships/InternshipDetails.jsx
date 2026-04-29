import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContextValue';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  MapPin, 
  Building2,
  FileText,
  Send, 
  Loader2,
  Calendar,
  ShieldCheck,
  Zap,
  Sparkles,
  Map as MapIcon,
  MessageSquare,
  AlertCircle,
  Terminal,
  Banknote,
  Briefcase,
  LogIn,
  UserPlus
} from 'lucide-react';
import AIRoadmap from '../../components/AIRoadmap';
import AIInterviewPrep from '../../components/AIInterviewPrep';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    resume: '',
    coverLetter: ''
  });

  // AI Insights State
  const [aiRoadmap, setAiRoadmap] = useState(null);
  const [aiPrep, setAiPrep] = useState(null);
  const [aiMatch, setAiMatch] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [prepLoading, setPrepLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState(null);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const { data } = await api.get(`/internships/${id}`);
        setInternship(data);
      } catch {
        toast.error('Could not load opportunity parameters');
        navigate('/internships');
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id, navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please log in to apply.');
      navigate('/login', { state: { from: `/internships/${id}` } });
      return;
    }
    if (user?.role !== 'student') {
      toast.warning('Only Student nodes can apply for internships.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/applications', {
        internshipId: id,
        ...formData
      });
      toast.success('Application transmitted successfully!');
      navigate('/applications');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transmission failure');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchRoadmap = async () => {
    if (roadmapLoading) return;
    setActiveAiTab('roadmap');
    if (aiRoadmap) return;
    
    setRoadmapLoading(true);
    try {
      const { data } = await api.get(`/ai/roadmap/${id}`);
      setAiRoadmap(data);
    } catch {
      toast.error('Neural Roadmap generation failed');
      setActiveAiTab(null);
    } finally {
      setRoadmapLoading(false);
    }
  };

  const fetchPrep = async () => {
    if (prepLoading) return;
    setActiveAiTab('prep');
    if (aiPrep) return;

    setPrepLoading(true);
    try {
      const { data } = await api.get(`/ai/interview-prep/${id}`);
      setAiPrep(data);
    } catch {
      toast.error('Interview Logic Prep failed');
      setActiveAiTab(null);
    } finally {
      setPrepLoading(false);
    }
  };

  const fetchMatchScore = async () => {
    if (matchLoading) return;
    setActiveAiTab('match');
    if (aiMatch) return;

    setMatchLoading(true);
    try {
      const { data } = await api.get(`/ai/match/${id}`);
      setAiMatch(data);
    } catch {
      toast.error('Neural Match Score calculation failed');
      setActiveAiTab(null);
    } finally {
      setMatchLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Details...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      <button onClick={() => navigate('/internships')} className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-black uppercase tracking-widest text-[10px] group transition-colors">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Internships
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <header className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
               <div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">{internship.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    <span className="flex items-center gap-1.5"><Building2 size={14} className="text-blue-600"/> {internship.company}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-600"/> {internship.location}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-600"/> {new Date(internship.createdAt).toLocaleDateString()}</span>
                  </div>
               </div>
               <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                  <Briefcase size={32} />
               </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">STIPEND</p>
                  <p className="text-xl font-black text-emerald-600 flex items-center gap-2"><Banknote size={20} /> ₹{internship.stipend.toLocaleString()}<span className="text-[10px] text-slate-400 uppercase">/mo</span></p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">STATUS</p>
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">{internship.status}</span>
                </div>
             </div>
          </header>

          <section className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter border-b border-slate-100 pb-4 mb-6">Job Description</h3>
             <div className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
               {internship.description}
             </div>
          </section>

          {/* AI Section */}
          {isAuthenticated && user?.role === 'student' && (
            <section className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                     <Sparkles size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">AI Career Support</h2>
               </div>
               
               <div className="flex flex-wrap gap-2">
                  <button onClick={fetchMatchScore} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAiTab === 'match' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}`}>Match Analysis</button>
                  <button onClick={fetchRoadmap} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAiTab === 'roadmap' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}`}>Learning Roadmap</button>
                  <button onClick={fetchPrep} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAiTab === 'prep' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}`}>Interview Prep</button>
               </div>

               {activeAiTab === 'match' && (
                 <div className="animate-fade-in bg-blue-50/50 p-8 rounded-3xl border-2 border-blue-100">
                   {matchLoading ? (
                     <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-[10px]"><Loader2 className="animate-spin" size={16} /> Analyzing Match...</div>
                   ) : aiMatch ? (
                     <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 flex shrink-0 items-center justify-center rounded-full bg-white border-4 border-blue-600 text-2xl font-black text-blue-600">
                          {aiMatch.score}%
                        </div>
                        <p className="text-slate-700 font-medium italic">"{aiMatch.reasoning}"</p>
                     </div>
                   ) : null}
                 </div>
               )}

               {activeAiTab === 'roadmap' && <div className="animate-fade-in"><AIRoadmap data={aiRoadmap} loading={roadmapLoading} /></div>}
               {activeAiTab === 'prep' && <div className="animate-fade-in"><AIInterviewPrep data={aiPrep} loading={prepLoading} /></div>}
            </section>
          )}
        </div>

        <aside className="space-y-6 sticky top-32">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Apply Now</h3>
            
            {!isAuthenticated ? (
              <div className="text-center space-y-6">
                <p className="text-sm text-slate-500">Please sign in to your student account to apply.</p>
                <Link to="/login" className="btn btn-primary w-full py-4 uppercase text-xs font-black tracking-widest">Sign In</Link>
              </div>
            ) : user?.role === 'student' ? (
              <form onSubmit={handleApply} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resume URL</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-slate-900 text-sm focus:border-blue-500 transition-all" value={formData.resume} onChange={(e) => setFormData({...formData, resume: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cover Letter</label>
                  <textarea rows="4" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-slate-900 text-sm focus:border-blue-500 transition-all resize-none" value={formData.coverLetter} onChange={(e) => setFormData({...formData, coverLetter: e.target.value})} required></textarea>
                </div>
                <button type="submit" disabled={submitting} className="btn btn-primary w-full py-4 uppercase text-xs font-black tracking-widest flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : <>Transmit Application <Send size={16} /></>}
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recruiters cannot apply to internships.</p>
              </div>
            )}
          </div>

          {isAuthenticated && user?.role === 'student' && (
            <button onClick={() => navigate(`/internships/${id}/interview`)} className="w-full bg-slate-900 hover:bg-black text-white p-8 rounded-3xl flex flex-col items-center gap-4 transition-all shadow-xl shadow-slate-200">
               <Terminal size={32} className="text-blue-500" />
               <div className="text-center">
                 <h4 className="font-black text-lg uppercase tracking-tighter">Mock Interview</h4>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Practice with AI</p>
               </div>
            </button>
          )}
        </aside>
      </div>
    </div>
  );
};

export default InternshipDetails;

const Clock = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const ArrowRight = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
