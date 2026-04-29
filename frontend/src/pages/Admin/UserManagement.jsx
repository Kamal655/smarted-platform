import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import {
  Users,
  Shield,
  Trash2,
  Search,
  ChevronRight,
  Filter,
  UserCheck,
  Building2,
  GraduationCap,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      toast.error('Failed to sync user database.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user account? This action is irreversible.')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
        toast.info('User account deleted.');
      } catch {
        toast.error('Failed to delete user.');
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-rose-600" size={48} />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading User Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            User Management
            <span className="badge bg-slate-100 text-slate-500 text-[10px] !lowercase">{users.length} active users</span>
          </h2>
          <p className="text-slate-500 font-medium italic">Monitor and manage all active users within the system.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input-field !pl-12 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
            {['all', 'admin', 'recruiter', 'student'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${roleFilter === role ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card !p-0 overflow-hidden shadow-2xl shadow-rose-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 italic">
                <th className="px-8 py-6">User</th>
                <th className="px-6 py-6">Role</th>
                <th className="px-6 py-6">Email</th>
                <th className="px-6 py-6">Joined Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${u.role === 'admin' ? 'bg-rose-50 text-rose-600' :
                          u.role === 'recruiter' ? 'bg-indigo-50 text-indigo-600' :
                            'bg-emerald-50 text-emerald-600'
                        } group-hover:scale-110`}>
                        {u.role === 'admin' ? <Shield size={24} /> :
                          u.role === 'recruiter' ? <Building2 size={24} /> :
                            <GraduationCap size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter italic">ID: {u._id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`badge ${u.role === 'admin' ? 'bg-rose-100 text-rose-700' :
                        u.role === 'recruiter' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-emerald-100 text-emerald-700'
                      } !px-4 !py-1.5`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-6 font-medium text-slate-500 text-sm">{u.email}</td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="bg-slate-50 inline-block p-8 rounded-3xl border-2 border-dashed border-slate-200">
                      <AlertCircle className="mx-auto mb-4 text-slate-300" size={48} />
                      <p className="font-black text-slate-300 uppercase tracking-widest text-xs">No records matching search parameters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
