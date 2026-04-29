import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import {
  Users,
  Briefcase,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  UserCheck,
  AlertCircle,
  CheckSquare,
  Sparkles,
  Zap,
  Building2,
  TrendingUp,
  Banknote
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContextValue';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import AICandidateSummary from '../../components/AICandidateSummary';

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const [postings, setPostings] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [activeTasks, setActiveTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  // AI Summary State
  const [selectedAppForAi, setSelectedAppForAi] = useState(null);
  const [aiSummary, setAiSummary] = useState({}); // { [appId]: data }
  const [aiLoading, setAiLoading] = useState({}); // { [appId]: boolean }
  const [pipelineData, setPipelineData] = useState([]);
  const [velocityData, setVelocityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postingsRes, tasksRes] = await Promise.all([
          api.get('/internships/my-postings'),
          api.get('/tasks')
        ]);
        setPostings(postingsRes.data);
        const myTasks = tasksRes.data.filter(t => t.assignedBy === user._id);
        setActiveTasks(myTasks.filter(t => t.status !== 'Completed').length);

        // Fetch applicants for the most recent posting to show on dashboard
        if (postingsRes.data.length > 0) {
          const applicantsRes = await api.get(`/applications/internship/${postingsRes.data[0]._id}`);
          setAllApplicants(applicantsRes.data);
        }
      } catch (error) {
        console.error('Data fetch error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Pipeline Data
    setPipelineData([
      { name: 'Applied', value: 45, color: '#64748b' },
      { name: 'Shortlisted', value: 28, color: '#3b82f6' },
      { name: 'Interviewed', value: 15, color: '#6366f1' },
      { name: 'Hired', value: 8, color: '#10b981' },
    ]);

    // Hiring Data
    setVelocityData([
      { name: 'Week 1', apps: 12 },
      { name: 'Week 2', apps: 19 },
      { name: 'Week 3', apps: 15 },
      { name: 'Week 4', apps: 27 },
    ]);
  }, [user._id]);

  const handleUpdateAppStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}`, { status });
      setAllApplicants(allApplicants.map(a => a._id === appId ? { ...a, status } : a));
      toast.success(`Candidate ${status.toLowerCase()} successfully.`);
    } catch {
      toast.error('Failed to update application status.');
    }
  };

  const fetchAiSummary = async (app) => {
    if (aiLoading[app._id]) return;
    setSelectedAppForAi(selectedAppForAi === app._id ? null : app._id);

    if (aiSummary[app._id]) return;

    setAiLoading(prev => ({ ...prev, [app._id]: true }));
    try {
      const { data } = await api.get(`/ai/candidate-summary/${app.student._id}/${app.internship._id}`);
      setAiSummary(prev => ({ ...prev, [app._id]: data }));
    } catch {
      toast.error('Failed to generate AI candidate insight.');
    } finally {
      setAiLoading(prev => ({ ...prev, [app._id]: false }));
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Clock className="animate-spin text-blue-500" size={40} /></div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-1 uppercase tracking-tighter">Recruitment Dashboard</h2>
          <p className="text-slate-500 font-medium italic">Manage active internships and review your talent pipeline.</p>
        </div>
        <Link to="/post-internship" className="btn btn-primary lg:px-8 uppercase font-black text-[10px] tracking-widest">
          <PlusCircle size={20} />
          <span>Post Internship</span>
        </Link>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card flex items-center gap-5 border-l-8 border-l-slate-900 group">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Postings</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{postings.length}</p>
              <p className="text-[10px] text-blue-600 font-bold mt-2 italic">Live Internships</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-5 border-l-8 border-l-blue-600 group">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Applicants</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{allApplicants.length}</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-2">All Candidates</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-5 border-l-8 border-l-indigo-600 group">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <CheckSquare size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">My Tasks</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{activeTasks}</p>
              <p className="text-[10px] text-indigo-600 font-bold mt-2 italic">Assigned Tasks</p>
            </div>
          </div>
        </div>

        {/* ── Hiring Activity Sparkline ── */}
        <div className="glass-card !p-4 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiring Activity</p>
            <TrendingUp size={14} className="text-blue-500" />
          </div>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityData}>
                <Bar dataKey="apps" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Building2 size={16} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Candidate Pipeline</h3>
            </div>
            <Link to="/my-postings" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline italic">Manage All</Link>
          </div>

          <div className="glass-card flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              {pipelineData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900">Recent Applications</h3>
          <div className="space-y-4">
            {allApplicants.length > 0 ? (
              allApplicants.map(app => (
                <div key={app._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="p-4 flex items-center gap-4 group cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors uppercase">
                      {app.student?.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase text-xs tracking-tighter">{app.student?.name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase ${app.status === 'Accepted' ? 'text-emerald-500' :
                            app.status === 'Rejected' ? 'text-rose-500' : 'text-slate-400'
                          }`}>
                          {app.status}
                        </span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <p className="text-[10px] text-slate-400 font-medium italic truncate w-32">{app.internship?.title}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {app.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateAppStatus(app._id, 'Accepted')}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Accept Candidate"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button
                            onClick={() => handleUpdateAppStatus(app._id, 'Rejected')}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Reject Candidate"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); fetchAiSummary(app); }}
                        className={`p-2 transition-colors rounded-lg ${selectedAppForAi === app._id ? 'bg-indigo-600 text-white' : 'text-indigo-400 hover:bg-indigo-50'}`}
                        title="AI Candidate Summary"
                      >
                        <Sparkles size={16} />
                      </button>
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Resume"
                      >
                        <ChevronRight size={16} />
                      </a>
                    </div>
                  </div>
                  {/* AI Summary Section (Expandable) */}
                  {selectedAppForAi === app._id && (
                    <div className="bg-indigo-50/10 p-4 border-t border-indigo-100 animate-fade-in">
                      <AICandidateSummary
                        data={aiSummary[app._id]}
                        loading={aiLoading[app._id]}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center opacity-70 italic font-medium text-slate-400">
                Awaiting new applicants...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
