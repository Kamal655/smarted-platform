import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { 
  Users, Briefcase, Shield, UserCheck, Mail, Calendar, 
  Search, Filter, Plus, Loader2, BarChart
} from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, tasksRes] = await Promise.all([
          api.get('/users'),
          api.get('/tasks')
        ]);
        setUsers(usersRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error('Data sync failure:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recruiterCount = users.filter(u => u.role === 'recruiter').length;
  const studentCount = users.filter(u => u.role === 'student').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-slate-900" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Systems Administration</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Platform Governance & Audit</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline py-2.5 px-6 rounded-xl flex items-center gap-2">
            <BarChart size={16} /> Reports
          </button>
          <button className="btn btn-primary py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-xl shadow-slate-900/20">
            <Plus size={16} /> Register Internal User
          </button>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Total Students', value: studentCount, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: UserCheck, label: 'Active Recruiters', value: recruiterCount, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { icon: Briefcase, label: 'System Tasks', value: tasks.length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: Shield, label: 'System Status', value: 'Live', color: 'text-slate-900', bg: 'bg-slate-100' }
        ].map((item, i) => (
          <div key={i} className="glass-card !p-6 flex flex-col justify-between hover:scale-[1.02] transition-all">
            <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4`}>
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">{item.label}</p>
              <p className="text-2xl font-black text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── User Directory ── */}
      <div className="glass-card !p-0 overflow-hidden shadow-2xl border-none">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Personnel Directory</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage global user access roles</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-300" size={16} />
              <input type="text" placeholder="Search by name or email..." className="form-input !py-2 !pl-10 !text-xs !bg-white" />
            </div>
            <button className="btn btn-outline !py-2 !px-4"><Filter size={16} /></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Role</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Email</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      u.role === 'admin' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                      u.role === 'recruiter' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Mail size={12} className="text-slate-300" /> {u.email}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                      <Calendar size={12} /> {new Date(u.createdAt).toLocaleDateString()}
                    </div>
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
