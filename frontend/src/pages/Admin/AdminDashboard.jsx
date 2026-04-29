import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import {
  Users,
  Briefcase,
  FileText,
  ShieldCheck,
  TrendingUp,
  Trash2,
  MoreVertical,
  ChevronRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [growthData, setGrowthData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/users')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Admin data sync failure', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // User Growth Data
    setGrowthData([
      { name: 'Jan', users: 400, apps: 240 },
      { name: 'Feb', users: 600, apps: 380 },
      { name: 'Mar', users: 800, apps: 520 },
      { name: 'Apr', users: 1100, apps: 750 },
    ]);

    // User Distribution Data
    setDistributionData([
      { name: 'Students', value: 70, color: '#3b82f6' },
      { name: 'Recruiters', value: 20, color: '#4f46e5' },
      { name: 'Admins', value: 10, color: '#10b981' },
    ]);
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user account? This action is irreversible.')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
        toast.info('User access terminated.');
      } catch {
        toast.error('Failed to terminate user.');
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Clock className="animate-spin text-blue-500" size={40} /></div>;

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-xl shadow-rose-600/30">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-500 font-medium italic">High-level administrative oversight and metrics.</p>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card flex items-center gap-5 border-l-8 border-l-slate-900 group">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Users</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{stats?.totalUsers}</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-2">+12% User Growth</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-5 border-l-8 border-l-blue-600 group">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Job Postings</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{stats?.totalInternships}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-2 italic">Active Internships</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-5 border-l-8 border-l-indigo-600 group">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Applications</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{stats?.totalApplications}</p>
              <p className="text-[10px] text-indigo-600 font-bold mt-2 italic">Total Applications</p>
            </div>
          </div>
        </div>

        {/* ── System Status ── */}
        <div className="glass-card !p-6 flex flex-col justify-between bg-white border border-slate-100 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black text-slate-900 leading-none">Healthy</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-2 italic uppercase">All Systems Operational</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl opacity-50" />
        </div>
      </section>

      {/* ── Analytics Hub ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp size={18} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">User Growth</h3>
          </div>
          <div className="glass-card h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="adminColorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#adminColorUsers)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users size={18} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">User Demographics</h3>
          </div>
          <div className="glass-card h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <p className="text-2xl font-black text-slate-900 uppercase">Users</p>
              <p className="text-[8px] font-black text-slate-400 tracking-[0.2em] uppercase">Breakdown</p>
            </div>
          </div>
        </div>
      </section>

      <div className="glass-card !p-0 overflow-hidden shadow-2xl shadow-slate-900/5">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="text-xl font-black text-slate-900">Personnel Directory</h3>
          <div className="flex gap-2">
            <span className="badge bg-blue-50 text-blue-700 border border-blue-100">{users.length} Records</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">User</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5">Registry Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 transition-all uppercase">
                        {u.name?.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`badge ${u.role === 'admin' ? 'bg-rose-100 text-rose-700' :
                        u.role === 'recruiter' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-emerald-100 text-emerald-700'
                      }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-500 text-sm italic">{u.email}</td>
                  <td className="px-6 py-5 text-xs font-bold text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
