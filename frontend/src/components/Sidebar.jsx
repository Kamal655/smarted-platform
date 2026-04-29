import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextValue';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Settings,
  LogOut,
  PlusCircle,
  Search,
  CheckSquare,
  Brain,
  User,
  Zap,
  Shield
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Internships', path: '/internships', icon: <Search size={18} /> },
    { name: 'Applications', path: '/applications', icon: <FileText size={18} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={18} /> },
    { name: 'Resume Review', path: '/resume-analyzer', icon: <FileText size={18} /> },
  ];

  const recruiterLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Talent Pool', path: '/talent', icon: <Users size={18} /> },
    { name: 'My Postings', path: '/my-postings', icon: <Briefcase size={18} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={18} /> },
    { name: 'Post Internship', path: '/post-internship', icon: <PlusCircle size={18} /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Users', path: '/users', icon: <Users size={18} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={18} /> },
    { name: 'All Internships', path: '/internships', icon: <Briefcase size={18} /> },
  ];

  const links = user?.role === 'admin' ? adminLinks :
    user?.role === 'recruiter' ? recruiterLinks :
      studentLinks;

  return (
    <aside className="w-64 h-screen bg-white/70 backdrop-blur-xl border-r border-slate-100 fixed left-0 top-0 hidden lg:flex flex-col z-20">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Briefcase size={18} />
          </div>
          <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">
            SmartED <span className="text-blue-600">Internships</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 opacity-70 italic">Navigation</p>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10'
                : 'text-slate-500 hover:bg-slate-50 font-bold'}`
            }
          >
            <span className={`transition-transform group-hover:scale-110`}>{link.icon}</span>
            <span className="text-xs font-black uppercase tracking-widest">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-2xl mb-4 transition-all
            ${isActive ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50 border border-transparent hover:border-slate-200'}`
          }
        >
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-800 uppercase shadow-sm overflow-hidden shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0)
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-black text-slate-900 uppercase truncate leading-none mb-1">{user?.name}</p>
            <div className="flex items-center gap-1">
              <Shield size={8} className="text-emerald-500" />
              <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">{user?.role}</p>
            </div>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all text-xs font-black uppercase tracking-widest mb-6"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>

        <div className="px-4 py-4 border-t border-slate-100/50 text-center">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Empowering Your IT Journey</p>
          <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">by SmartED Innovations</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
