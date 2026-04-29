import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatAssistant from './ChatAssistant';
import { Menu, X, Bell, User, Cpu, LogIn } from 'lucide-react';
import { AuthContext } from '../context/AuthContextValue';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      {/* Sidebar - Desktop (Only for Authenticated Users) */}
      {isAuthenticated && <Sidebar />}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isAuthenticated ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Header - Desktop & Mobile */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 sticky top-0 bg-white/80 backdrop-blur-xl z-30 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
                aria-label="Toggle Sidebar"
              >
                {isSidebarOpen ? <X size={24} className="text-slate-600" /> : <Menu size={24} className="text-slate-600" />}
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Cpu size={16} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm tracking-tighter text-slate-900 uppercase leading-none">
                  SmartED <span className="text-blue-600">Innovations</span>
                </span>
                <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">Portal</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {!isAuthenticated ? (
              <Link to="/login" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
                <LogIn size={14} /> Portal Login
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="w-px h-6 bg-slate-200 hidden lg:block"></div>
                <div className="flex items-center gap-3">
                  <button 
                    className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 shadow-sm transition-all hover:border-blue-500/50 hover:text-blue-600 cursor-pointer overflow-hidden group" 
                    onClick={() => navigate('/profile')}
                    aria-label="User Profile"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <User size={20} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-10 animate-fade-in relative">
          {/* Background Ambient Glow (Subtle for light mode) */}
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-600/[0.03] blur-[120px] rounded-full pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-600/[0.03] blur-[120px] rounded-full pointer-events-none -z-10" />
          
          {children}
        </main>

        <footer className="p-10 text-center border-t border-slate-200 mt-auto bg-white/50 backdrop-blur-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
            SmartED Innovations • Ecosystem Node
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            © {new Date().getFullYear()} Official Career Portal. All systems secured and monitored.
          </p>
        </footer>
      </div>

      {/* Mobile Sidebar Overlay (Only for Authenticated Users) */}
      {isAuthenticated && isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-64 bg-white h-full shadow-2xl border-r border-slate-100 animate-fade-in">
             <Sidebar />
          </div>
        </div>
      )}

      {/* Floating Chat Assistant */}
      <ChatAssistant />
    </div>
  );
};

export default Layout;
