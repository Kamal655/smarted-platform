import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { 
  Users, Briefcase, FileText, TrendingUp, Search, Filter, 
  ExternalLink, CheckCircle2, Clock, MapPin, DollarSign, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({ totalPostings: 0, totalApplicants: 0, activeInterns: 0 });
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const [postsRes, appsRes] = await Promise.all([
          api.get('/internships'),
          api.get('/applications/recruiter-view') // We'll need this endpoint or a fallback
        ]);
        
        // Mocking some recruiter data if real endpoints aren't available yet
        setPostings(postsRes.data.slice(0, 5));
        
        setStats({
          totalPostings: postsRes.data.length,
          totalApplicants: appsRes.data?.length || 24,
          activeInterns: 12
        });
      } catch (error) {
        console.error('Recruiter data failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiterData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Recruiter Console</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Talent Acquisition & Management</p>
        </div>
        <Link to="/post-internship" className="btn btn-primary !py-3 !px-8 shadow-xl shadow-blue-500/20">
          Post New Internship
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Briefcase, label: 'Live Postings', value: stats.totalPostings, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Users, label: 'Total Applicants', value: stats.totalApplicants, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: TrendingUp, label: 'Active Interns', value: stats.activeInterns, color: 'text-indigo-600', bg: 'bg-indigo-50' }
        ].map((item, i) => (
          <div key={i} className="glass-card flex items-center gap-6 group hover:scale-[1.02] transition-all">
            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shadow-sm`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{item.label}</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* ── Recently Posted Roles ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Postings</h2>
            <Link to="/internships" className="text-xs font-black text-blue-600 uppercase hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {postings.map((post) => (
              <div key={post._id} className="glass-card !p-6 group hover:border-blue-200 transition-all cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Briefcase size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors uppercase tracking-tight">{post.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1"><MapPin size={12}/> {post.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-emerald-600"><DollarSign size={12}/> ₹{post.stipend?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Applicants</p>
                    <p className="text-lg font-black text-slate-900">12</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions / Recent Activity ── */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { type: 'Application', user: 'Kamal Subedi', role: 'Frontend Intern', time: '2h ago' },
              { type: 'Update', user: 'System', role: 'Internship Approved', time: '5h ago' },
              { type: 'Application', user: 'Alex Rivera', role: 'UX Designer', time: '8h ago' }
            ].map((act, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  {act.type === 'Application' ? <FileText size={16} /> : <CheckCircle2 size={16} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-snug"><span className="font-black">{act.user}</span> applied for <span className="text-blue-600">{act.role}</span></p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                    <Clock size={10} /> {act.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
             <h3 className="text-sm font-black uppercase tracking-widest mb-3 text-blue-400">Recruiter Tip</h3>
             <p className="text-xs text-slate-300 font-medium leading-relaxed">
               Did you know? Job postings with clear, concise descriptions get <span className="text-white font-bold">40% more applicants</span> on average.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecruiterDashboard;
