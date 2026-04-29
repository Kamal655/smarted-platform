import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextValue';
import NotificationDropdown from './NotificationDropdown';
import { LogOut, LayoutDashboard, Brain, User } from 'lucide-react';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo & Primary Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Brain size={22} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-blue-600 transition-colors uppercase">
                SmartED <span className="text-slate-900">Internships</span>
              </span>
            </Link>

            {user && (
              <Link
                to="/"
                className="hidden md:flex items-center gap-2 text-sm font-black text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
          </div>

          {/* User Actions & Notifications */}
          <div className="flex items-center gap-2 sm:gap-4 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100">
            {user ? (
              <>
                <NotificationDropdown />

                <div className="w-px h-6 bg-slate-200 mx-1" />

                <button
                  onClick={() => navigate('/profile')}
                  className="p-2.5 rounded-xl bg-white text-slate-500 hover:text-blue-600 border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95"
                  title="My Profile"
                >
                  <User size={20} />
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300 group"
                  title="Logout"
                >
                  <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-xs font-black text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-500/25 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
